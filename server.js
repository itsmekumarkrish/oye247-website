require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
// 1. Ensure the server uses dynamic port
const PORT = process.env.PORT || 8080;

// 2. Verify Express setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Health check for Railway
app.get('/health', (req, res) => res.status(200).send('OK'));

// Legal & Contact Pages
app.get('/privacy-policy', (req, res) => res.sendFile(path.join(__dirname, 'privacy-policy.html')));
app.get('/terms-of-service', (req, res) => res.sendFile(path.join(__dirname, 'terms-of-service.html')));
app.get('/refund-policy', (req, res) => res.sendFile(path.join(__dirname, 'refund-policy.html')));
app.get('/disclaimer', (req, res) => res.sendFile(path.join(__dirname, 'disclaimer.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'contact.html')));


// 3. Ensure MongoDB connection uses process.env.MONGO_URI and handles errors gracefully
if (process.env.MONGO_URI) {
    try {
        const mongoose = require('mongoose');
        mongoose.connect(process.env.MONGO_URI)
            .then(() => console.log('✅ MongoDB connected successfully'))
            .catch(err => console.error('❌ MongoDB connection failed:', err.message));
    } catch (err) {
        console.warn('⚠️  MONGO_URI provided but mongoose is not installed.');
    }
} else {
    console.log('ℹ️  MONGO_URI not provided. Skipping MongoDB connection.');
}

// 4. Ensure JWT secret uses process.env.JWT_SECRET
if (!process.env.JWT_SECRET) {
    console.warn('⚠️  JWT_SECRET is not defined in the environment.');
}

// 5. Ensure Stripe uses process.env.STRIPE_KEY
if (process.env.STRIPE_KEY) {
    try {
        const stripe = require('stripe')(process.env.STRIPE_KEY);
        console.log('✅ Stripe initialized successfully');
    } catch (err) {
        console.warn('⚠️  STRIPE_KEY provided but stripe package is not installed.');
    }
} else {
    console.log('ℹ️  STRIPE_KEY not provided. Skipping Stripe initialization.');
}

// 6. Add a basic health check route
// NOTE: I placed this on /health instead of / so that it DOES NOT BREAK your landing page (which serves index.html on /)
app.get('/health', (req, res) => {
    res.send("Server is running");
});

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// ===== Contact Form API =====
app.post('/api/contact', async (req, res, next) => {
    try {
        const { name, phone, email, business, leads, message } = req.body;

        // Validate required fields
        if (!name || !phone) {
            return res.status(400).json({ error: 'Name and Phone are required.' });
        }

        console.log('\n📩 New Lead Received:');
        console.log('─────────────────────');
        console.log(`Name:     ${name}`);
        console.log(`Phone:    ${phone}`);
        console.log(`Email:    ${email || 'Not provided'}`);
        console.log(`Business: ${business || 'Not selected'}`);
        console.log(`Leads:    ${leads || 'Not selected'}`);
        console.log(`Message:  ${message || 'No message'}`);
        console.log('─────────────────────\n');

        // Send emails only if SMTP is configured
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            try {
                // 1. Admin Notification Email
                await transporter.sendMail({
                    from: `"OyeHQ Leads" <${process.env.SMTP_USER}>`,
                    to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
                    subject: 'New Automation Lead Received',
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0a0a0f; color: #ffffff; border-radius: 12px;">
                            <h2 style="color: #14F1D9; margin-bottom: 20px;">🚀 New Automation Lead</h2>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                                    <td style="padding: 12px 0; color: #9CA3AF; width: 140px;">Name</td>
                                    <td style="padding: 12px 0; font-weight: 600;">${name}</td>
                                </tr>
                                <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                                    <td style="padding: 12px 0; color: #9CA3AF;">Phone</td>
                                    <td style="padding: 12px 0; font-weight: 600;">${phone}</td>
                                </tr>
                                <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                                    <td style="padding: 12px 0; color: #9CA3AF;">Email</td>
                                    <td style="padding: 12px 0;">${email || 'Not provided'}</td>
                                </tr>
                                <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                                    <td style="padding: 12px 0; color: #9CA3AF;">Business Type</td>
                                    <td style="padding: 12px 0;">${business || 'Not selected'}</td>
                                </tr>
                                <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                                    <td style="padding: 12px 0; color: #9CA3AF;">Monthly Leads</td>
                                    <td style="padding: 12px 0;">${leads || 'Not selected'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0; color: #9CA3AF;">Message</td>
                                    <td style="padding: 12px 0;">${message || 'No message'}</td>
                                </tr>
                            </table>
                            <p style="margin-top: 20px; color: #9CA3AF; font-size: 12px;">Received at ${new Date().toLocaleString()}</p>
                        </div>
                    `
                });
                console.log('✅ Admin notification email sent.');

                // 2. User Confirmation Email (only if email provided)
                if (email) {
                    await transporter.sendMail({
                        from: `"OyeHQ" <${process.env.SMTP_USER}>`,
                        to: email,
                        subject: 'Your Automation Plan Request Received',
                        html: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #0a0a0f; color: #ffffff; border-radius: 12px;">
                                <h2 style="color: #14F1D9; margin-bottom: 10px;">Thank You, ${name}!</h2>
                                <p style="color: #A1A1AA; line-height: 1.8; font-size: 15px;">
                                    We've received your request for a personalized AI automation plan and our team is currently reviewing your details to better understand your business needs.
                                </p>
                                <p style="color: #A1A1AA; line-height: 1.8; font-size: 15px;">
                                    One of our specialists will connect with you shortly to walk you through the next steps and show how AI can help automate your workflows, capture more leads, and improve conversions.
                                </p>
                                <p style="color: #A1A1AA; line-height: 1.8; font-size: 15px;">
                                    If your request is urgent, you can reply to this email or connect with us on WhatsApp.
                                </p>
                                <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                                    <p style="color: #A1A1AA; line-height: 1.8; font-size: 15px;">
                                        We look forward to helping you automate and grow your business.
                                    </p>
                                    <p style="color: #14F1D9; font-weight: 600; font-size: 15px;">– Team OyeHQ</p>
                                </div>
                            </div>
                        `
                    });
                    console.log('✅ User confirmation email sent to:', email);
                }
            } catch (emailErr) {
                console.error('⚠️  Email sending failed:', emailErr.message);
                // Don't fail the API — lead is still logged
            }
        } else {
            console.log('ℹ️  SMTP not configured. Skipping email notifications.');
            console.log('   Set SMTP_USER and SMTP_PASS in .env to enable emails.');
        }

        res.json({ success: true, message: 'Lead received successfully.' });
    } catch (error) {
        // Pass to global error handler
        next(error); 
    }
});

// Serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Legal Pages Routes
const legalPages = ['privacy-policy', 'refund-policy', 'disclaimer', 'terms-of-service', 'contact'];
legalPages.forEach(page => {
    app.get(`/${page}`, (req, res) => {
        res.sendFile(path.join(__dirname, `${page}.html`));
    });
});

// 7. Add proper error handling middleware (Graceful error handling)
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.message || err);
    res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
    });
});

// 8. Make sure there are NO hardcoded ports like 3000 in app.listen
// 9. Optimize for Render deployment: No localhost dependencies, clean console logs
app.listen(PORT, () => {
    console.log(`🚀 Server is live on port ${PORT}`);
});
