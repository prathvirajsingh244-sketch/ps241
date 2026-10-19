import unittest

from fastapi.testclient import TestClient

from app.ai_service import build_gemini_payload, generate_counselling_reply, should_use_gemini
from app.main import app


class GeminiConfigTests(unittest.TestCase):
    def test_should_use_gemini_requires_key(self):
        self.assertFalse(should_use_gemini(''))
        self.assertTrue(should_use_gemini('test-key'))

    def test_build_gemini_payload_includes_user_question(self):
        payload = build_gemini_payload('What is solar technician?', 'en')
        self.assertIn('contents', payload)
        self.assertIn('What is solar technician?', payload['contents'][0]['parts'][0]['text'])

    def test_generate_counselling_reply_uses_fallback_without_key(self):
        reply = generate_counselling_reply('What is solar?', 'en', '')
        self.assertTrue(reply['fallback_used'])
        self.assertIn('solar', reply['answer'].lower())


class VideoEndpointTests(unittest.TestCase):
    def test_list_videos_returns_latest_published_items(self):
        client = TestClient(app)
        response = client.get('/api/v1/videos', params={'language': 'hi'})

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data)
        self.assertTrue(all(item['language'] == 'hi' for item in data))
        self.assertNotIn('A Day in the Life of an ITI Electrician', [item['title'] for item in data])
        self.assertIn('ITI Electrician 1st year syllabus 2027 | ये पढ़ना होगा ITI Exam 2027 के लिए | ITI Exam 2027 | ITI Exam', [item['title'] for item in data])


if __name__ == '__main__':
    unittest.main()
