import re

html_file = 'index.html'
with open(html_file, 'r') as f:
    content = f.read()

testimonials = [
    {
        "name": "Rahul Sharma",
        "type": "Real Estate",
        "text": '"We integrated Oye247 and saw our lead conversions jump by 3x within just three weeks. It’s like having a top-performing SDR working 24/7 without taking breaks."'
    },
    {
        "name": "Priya Mehta",
        "type": "E-commerce",
        "text": '"Handling support tickets used to drain our team\'s energy. Now, 80% of routine customer queries are resolved instantly, freeing us up to focus on growth."'
    },
    {
        "name": "Arjun Reddy",
        "type": "Coaching",
        "text": '"I never miss a potential client anymore. Everything from initial contact to qualifying questions is automated seamlessly."'
    },
    {
        "name": "Karan Verma",
        "type": "Digital Agency",
        "text": '"Our average response time went from hours down to literal seconds. The boost in client satisfaction and retention has been absolutely incredible."'
    },
    {
        "name": "Sneha Iyer",
        "type": "Healthcare Clinic",
        "text": '"Patient appointments are now booked automatically without endless phone tags. Our front desk is finally completely stress-free."'
    },
    {
        "name": "Amit Patel",
        "type": "Local Business",
        "text": '"We started getting significantly more walk-ins simply because our WhatsApp automation replies instantly to every single inquiry we receive."'
    },
    {
        "name": "Neha Kapoor",
        "type": "SaaS Startup",
        "text": '"Our entire user onboarding process is fully automated now. It guides new signups step-by-step, drastically reducing our initial churn rate."'
    },
    {
        "name": "Rohit Singh",
        "type": "EdTech",
        "text": '"Prospective student inquiries are handled 24/7 without any manual effort. Our enrollment numbers have steadily climbed since launch."'
    },
    {
        "name": "Pooja Nair",
        "type": "Salon Chain",
        "text": '"We virtually eliminated missed calls and doubled our weekend bookings. The AI acts as our dedicated receptionist around the clock."'
    },
    {
        "name": "Vivek Gupta",
        "type": "Finance",
        "text": '"Lead qualification became completely effortless. My sales team only talks to highly qualified prospects who are actually ready to buy."'
    },
    {
        "name": "Ankit Jain",
        "type": "Marketing Agency",
        "text": '"Our team\'s manual workload was reduced by 60%. We repurposed that saved time into creative strategy, which directly boosted our revenue."'
    },
    {
        "name": "Riya Sharma",
        "type": "Fitness Coach",
        "text": '"New clients are onboarded automatically with zero friction. The experience feels highly personalized, and they love the instant responses."'
    },
    {
        "name": "Suresh Kumar",
        "type": "Retail",
        "text": '"We capture every single lead now, across all channels. Nothing falls through the cracks, and our sales pipeline has never looked healthier."'
    },
    {
        "name": "Deepak Yadav",
        "type": "Logistics",
        "text": '"Logistics operations became so much faster with these automation workflows. We update clients automatically without lifting a finger."'
    },
    {
        "name": "Meena Reddy",
        "type": "Boutique",
        "text": '"Our overall sales improved by 40% without needing to hire additional staff. The AI scales effortlessly as our business volume grows."'
    }
]

def generate_cards():
    cards_html = ""
    for t in testimonials:
        cards_html += f'''                    <div class="testi-card">
                        <div class="testi-header">
                            <div class="testi-avatar"><i class="ph ph-user"></i></div>
                            <div class="testi-info">
                                <h4>{t['name']}</h4>
                                <span>{t['type']}</span>
                            </div>
                        </div>
                        <p>{t['text']}</p>
                    </div>\n'''
    return cards_html

new_track_html = f'''            <div class="testi-track">
                <!-- Group 1 -->
                <div class="testi-group">
{generate_cards()}                </div>
                <!-- Group 2 (Duplicate for infinite scroll) -->
                <div class="testi-group" aria-hidden="true">
{generate_cards()}                </div>
            </div>'''

# regex replace
pattern = r'            <div class="testi-track">.*?            </div>'
new_content = re.sub(pattern, new_track_html, content, flags=re.DOTALL)

with open(html_file, 'w') as f:
    f.write(new_content)

print("Updated index.html successfully.")
