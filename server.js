require('dotenv').config();
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(express.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

app.post('/call', async (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber.startsWith('+91')) {
        return res.status(400).json({ message: 'Invalid Indian phone number format!' });
    }

    try {
        const call = await client.calls.create({
            url: 'http://demo.twilio.com/docs/voice.xml', // Replace with your TwiML Bin URL
            to: phoneNumber,
            from: twilioNumber
        });

        res.json({ message: 'Call initiated successfully!', callSid: call.sid });
    } catch (error) {
        res.status(500).json({ message: 'Error making call', error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
