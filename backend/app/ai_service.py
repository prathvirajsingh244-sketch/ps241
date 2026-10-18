from __future__ import annotations

import json
from typing import Any
from urllib import error, request

from app.config import settings


SYSTEM_PROMPT = (
    'You are a career counsellor for Indian students and parents. ' 
    'Answer in a practical, supportive, and factual way. ' 
    'Give useful next steps, mention likely eligibility, duration, and job outlook when relevant. ' 
    'Prefer verified career guidance information and suggest human counselling when the question is highly personal.'
)


def should_use_gemini(api_key: str | None) -> bool:
    return bool(api_key and api_key.strip())


def build_gemini_payload(message: str, language: str) -> dict[str, Any]:
    lang_instruction = 'Respond in Hindi and use clear, simple Hindi.' if language == 'hi' else 'Respond in English.'
    prompt = (
        f'{SYSTEM_PROMPT} {lang_instruction}\n\n'
        f'User question: {message}\n\n'
        'Provide a concise answer with 2-4 bullet points or a short helpful paragraph. '
        'If needed, include a short source note like “Source: NSDC / NCVT / DGT / Ministry guidance” and mention \n'
        'whether a human counsellor may be helpful.'
    )
    return {
        'contents': [
            {
                'role': 'user',
                'parts': [{'text': prompt}],
            }
        ],
        'generationConfig': {
            'temperature': 0.3,
            'topP': 0.9,
            'maxOutputTokens': 600,
        },
    }


def _fallback_reply(message: str, language: str) -> dict[str, Any]:
    msg_lower = message.lower()
    is_hindi = language == 'hi' or any('\u0900' <= ch <= '\u097F' for ch in message)

    if any(k in msg_lower for k in ['salary', 'कमाई', 'सैलरी', 'पैसे', 'package', 'earn']):
        if is_hindi:
            answer = (
                'वोकेशनल और ITI ट्रेड्स में शुरुआती सैलरी ₹12,000 से ₹25,000/माह होती है। '
                '2–3 साल के अनुभव, अप्रेंटिसशिप और NCVT सर्टिफिकेशन के बाद कुशल तकनीशियन ₹35,000 से ₹60,000+ प्रति माह कमाते हैं, '
                'और कई अपना खुद का उद्यम या कॉन्ट्रैक्टिंग व्यवसाय भी शुरू करते हैं।'
            )
        else:
            answer = (
                'Entry-level vocational careers typically start at ₹12,000–₹25,000/month. '
                'With 2–3 years of hands-on experience, NCVT certification, or specialized trade skills (like Solar or CNC machining), '
                'earnings can rise to ₹35,000–₹60,000+/month, with strong opportunities for self-employment.'
            )
        sources = ['DGET Wage Survey 2024', 'NSDC Vocational Placement Report']
        needs_human = False

    elif any(k in msg_lower for k in ['solar', 'सोलर', 'green', 'energy', 'अक्षय ऊर्जा']):
        if is_hindi:
            answer = (
                'सोलर पीवी इंस्टॉलर (Suryamitra) एक अत्यंत मांग वाला हरित रोजगार है। यह 3 महीने का राष्ट्रीय कौशल प्रमाणन कोर्स है, '
                'जिसके लिए न्यूनतम योग्यता 10वीं पास या ITI (इलेक्ट्रीशियन/फिटर) है। MNRE और Skill Council for Green Jobs द्वारा मान्यता प्राप्त है।'
            )
        else:
            answer = (
                'Solar PV Installer (Suryamitra) is a rapidly expanding green vocational path. '
                'It usually takes around 3 months under the Skill Council for Green Jobs (SCGJ), and the minimum eligibility is typically Class 10 or an ITI background.'
            )
        sources = ['MNRE Suryamitra Guidelines 2024', 'Skill Council for Green Jobs']
        needs_human = False

    elif any(k in msg_lower for k in ['admission', 'iti', 'एडमिशन', 'फॉर्म', 'apply', 'आवेदन']):
        if is_hindi:
            answer = (
                'सरकारी ITI में एडमिशन हर साल जून–जुलाई में राज्य स्तरीय ऑनलाइन काउंसलिंग (जैसे NCVT MIS या राज्य ITI पोर्टल) के माध्यम से होता है। '
                'अधिकांश ट्रेड्स 10वीं पास पर उपलब्ध हैं, और कुछ ट्रेड्स 8वीं पास पर भी स्वीकार करते हैं। सरकारी ITI की फीस नाममात्र (लगभग ₹1,000–₹2,500/वर्ष) होती है।'
            )
        else:
            answer = (
                'Government ITI admissions generally open between June and July through state counselling portals and NCVT MIS. '
                'Most technical trades require Class 10 pass; a few options accept students after Class 8. Fees in government institutes are heavily subsidised.'
            )
        sources = ['NCVT MIS Admission Portal 2024', 'Directorate General of Training (DGT)']
        needs_human = False

    elif any(k in msg_lower for k in ['parent', 'parents', 'माता-पिता', 'परिवार', 'mismatch', 'confused', 'दबाव']):
        if is_hindi:
            answer = (
                'माता-पिता स्वाभाविक रूप से अपने बच्चे के सुरक्षित भविष्य की चिंता करते हैं। आप हमारे पैरेंट डैशबोर्ड में “Expectations Form” भर सकते हैं, '
                'जहाँ AI तुलना रिपोर्ट तैयार की जाती है। अगर मतभेद बना रहे तो मानव काउंसलर से सत्र बुक करना सही रहेगा।'
            )
        else:
            answer = (
                'It is common for parents and students to have different expectations when choosing a career path. '
                'Our parent dashboard can compare expected outcomes against feasible training routes, and a human counsellor can help when the decision is sensitive.'
            )
        sources = ['MaargMitra Career Guidance Framework', 'Parental Counselling Protocol']
        needs_human = True

    else:
        if is_hindi:
            answer = (
                f'आपके सवाल “{message}” के संबंध में: वोकेशनल शिक्षा (ITI, PMKVY, पॉलिटेक्निक) व्यावहारिक कौशल और रोजगार पर केंद्रित है। '
                'आप हमारे “Career Explorer” में 250+ करियर देख सकते हैं, या “Assessment” पूरा करके आपके लिए सबसे उपयुक्त ट्रेड सुझा सकते हैं।'
            )
        else:
            answer = (
                f'Regarding “{message}”: vocational pathways such as ITI, PMKVY and Polytechnic courses focus on practical skills and job-readiness. '
                'We recommend checking the career explorer or taking the assessment to identify the best-fit options.'
            )
        sources = ['NSDC National Occupational Standards', 'DGET ITI Documentation']
        needs_human = False

    return {
        'answer': answer,
        'source_refs': sources,
        'needs_human_followup': needs_human,
        'fallback_used': True,
    }


def _parse_gemini_response(raw_response: str) -> str:
    data = json.loads(raw_response)
    candidates = data.get('candidates') or []
    for candidate in candidates:
        content = candidate.get('content') or {}
        parts = content.get('parts') or []
        for part in parts:
            text = part.get('text')
            if text:
                return text.strip()
    raise ValueError('Gemini response did not contain usable content')


def generate_counselling_reply(message: str, language: str, api_key: str | None = None) -> dict[str, Any]:
    if should_use_gemini(api_key or settings.gemini_api_key):
        try:
            payload = build_gemini_payload(message, language)
            request_data = json.dumps(payload).encode('utf-8')
            request_url = (
                f"https://generativelanguage.googleapis.com/v1beta/models/{settings.gemini_model}:generateContent"
                f"?key={(api_key or settings.gemini_api_key).strip()}"
            )
            req = request.Request(
                request_url,
                data=request_data,
                headers={'Content-Type': 'application/json'},
                method='POST',
            )
            with request.urlopen(req, timeout=30) as response:
                body = response.read().decode('utf-8')
            answer = _parse_gemini_response(body)
            return {
                'answer': answer,
                'source_refs': ['Gemini API response'],
                'needs_human_followup': 'human' in message.lower() or 'parent' in message.lower() or 'confused' in message.lower(),
                'fallback_used': False,
            }
        except (ValueError, json.JSONDecodeError, error.URLError, error.HTTPError):
            pass

    return _fallback_reply(message, language)
