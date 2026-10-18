import unittest

from app.ai_service import build_gemini_payload, generate_counselling_reply, should_use_gemini


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


if __name__ == '__main__':
    unittest.main()
