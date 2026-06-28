import re

file_path = r'C:\Users\user\OneDrive\Desktop\realty-new\realty-new\src\app\todd-statement\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    c = f.read()

# Total Paid block
c = c.replace('$2,000', '$500')
c = c.replace('Rent · Deposit received', 'Security Deposit received')

# Total Pending block
c = c.replace('$900', '$800')
c = c.replace('$100 balance + $800 month 3', 'Month 1 Rent')

# Total Lease Value block
c = c.replace('$2,900', '$1,300')
c = c.replace('Rent · Deposit · Fees', 'Rent · Deposit')

# Update Important Note
old_note = r'A total of <strong style={{ color: "#5a5048", fontWeight: 600 }}>Important:</strong> A total\s+of <strong style={{ color: "#5a5048" }}>\$800\.00</strong> is outstanding —\s+comprising the \$100 balance from month 2 and \$800 for month 3. Full payment is\s+required to finalize the rental agreement and release keys at 1139 Sanderson Ave,\s+Scranton, PA 18509.'
c = re.sub(
    r'<strong style={{ color: "#5a5048", fontWeight: 600 }}>Important:</strong> A total[\s\S]*?1139 Sanderson Ave,[\s\S]*?Scranton, PA 18509\.',
    '<strong style={{ color: "#5a5048", fontWeight: 600 }}>Important:</strong> A total of <strong style={{ color: "#5a5048" }}>$800.00</strong> is outstanding for the first month\'s rent. Full payment is required for the final process of ratification and to meet at the home at 1pm at 836 Rhodora Ave, Reading, PA 19605.',
    c
)

c = re.sub(
    r'<strong style={{ color: "#5a5048", fontWeight: 600 }}>Important:</strong> A total[\s\S]*?836 Rhodora Ave,[\s\S]*?Reading, PA 19605\.',
    '<strong style={{ color: "#5a5048", fontWeight: 600 }}>Important:</strong> A total of <strong style={{ color: "#5a5048" }}>$800.00</strong> is outstanding for the first month\'s rent. Full payment is required for the final process of ratification and to meet at the home at 1pm at 836 Rhodora Ave, Reading, PA 19605.',
    c
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(c)
