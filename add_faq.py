import re

html_file = 'index.html'
with open(html_file, 'r') as f:
    content = f.read()

faq_content = [
    {"q": "How does AI automation work for my business?", "a": "Our AI agents handle customer inquiries, qualify leads, and automate follow-ups instantly, reducing manual effort and increasing conversions."},
    {"q": "Do I need technical knowledge to use this?", "a": "No. Everything is set up for you. You can manage automation easily without any coding or technical skills."},
    {"q": "Can this integrate with WhatsApp and my CRM?", "a": "Yes. We integrate seamlessly with WhatsApp, websites, and popular CRM systems to ensure smooth operations."},
    {"q": "How quickly can I get started?", "a": "You can get started within 24–48 hours after setup. Our team handles onboarding and configuration."},
    {"q": "Will this replace my team?", "a": "No. It enhances your team by handling repetitive tasks so your team can focus on closing deals and growth."},
    {"q": "Is this suitable for small businesses?", "a": "Absolutely. Whether you're a startup or growing business, AI automation helps scale operations efficiently."},
    {"q": "Will this work for my specific industry?", "a": "Yes. Our AI adapts to your business model and works across industries like real estate, healthcare, e-commerce, agencies, and more. It captures leads, automates responses, and improves conversions based on your workflow."},
    {"q": "How secure is my data?", "a": "We use industry-standard security protocols to ensure your data remains safe and protected."},
    {"q": "What kind of results can I expect?", "a": "Businesses typically see faster response times, higher lead conversions, and improved customer experience."}
]

faq_html = '''    <!-- FAQ Section -->
    <section class="faq fade-up" id="faq">
        <div class="container">
            <div class="section-header text-center">
                <h2>Frequently Asked <span class="text-gradient">Questions</span></h2>
                <p>Everything you need to know before getting started with AI automation.</p>
            </div>
            <div class="faq-container">
'''
for item in faq_content:
    faq_html += f'''                <div class="faq-item">
                    <button class="faq-question">
                        <span>{item['q']}</span>
                        <i class="ph ph-plus faq-icon"></i>
                    </button>
                    <div class="faq-answer">
                        <div class="faq-answer-inner">
                            <p>{item['a']}</p>
                        </div>
                    </div>
                </div>
'''
faq_html += '''            </div>
        </div>
    </section>

    <!-- Demo Placeholder Section -->'''

content = content.replace("    <!-- Demo Placeholder Section -->", faq_html)

with open(html_file, 'w') as f:
    f.write(content)

print("FAQ section added to HTML.")
