from flask import Flask, render_template, jsonify
import requests
from bs4 import BeautifulSoup
import re
from PyPDF2 import PdfReader
import pandas as pd
import os
from dotenv import load_dotenv
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

# Load environment variables from .env file
load_dotenv()

# Access environment variables
CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
PROJECT_ID = os.getenv("GOOGLE_PROJECT_ID")
AUTH_URI = os.getenv("GOOGLE_AUTH_URI")
TOKEN_URI = os.getenv("GOOGLE_TOKEN_URI")
CERT_URL = os.getenv("GOOGLE_CERT_URL")

# Base URL for ISRO Press releases
base_url = "https://www.isro.gov.in"

# Initialize Flask app
app = Flask(__name__, static_folder = 'C:/Users/Ashutosh/Music/country_events_website/frontend/public', template_folder = 'C:/Users/Ashutosh/Music/country_events_website/frontend/public')

# Route to authenticate Google API
@app.route('/authenticate')
def authenticate_google_api():
    # OAuth2 flow for Google API
    flow = InstalledAppFlow.from_client_secrets_file(
        'client_secrets.json',  # Path to your Google OAuth client secrets
        scopes=['https://www.googleapis.com/auth/customsearch.readonly']
    )
    creds = flow.run_local_server(port=0)
    return jsonify({"message": "Google API authenticated successfully."})

# Route to search using Google Custom Search
@app.route('/search/<query>')
def google_search(query):
    service = build('customsearch', 'v1', developerKey=os.getenv('GOOGLE_API_KEY'))
    res = service.cse().list(q=query, cx=os.getenv('SEARCH_ENGINE_ID')).execute()
    
    results = []
    for item in res.get('items', []):
        results.append({
            "title": item['title'],
            "link": item['link'],
            "snippet": item.get('snippet', 'No description available')
        })
    
    return jsonify(results)


# Function to scrape ISRO press releases

def scrape_page(page_url):
    response = requests.get(page_url)
    press_releases = []

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        table = soup.find('table', {'class': 'table-info'})

        if table:
            rows = table.find('tbody').find_all('tr')
            for row in rows:
                title_element = row.find('td', {'class': 'title1'})
                date_element = row.find('td', {'class': 'date1'})
                link_element = title_element.find('a') if title_element else None

                if title_element and date_element and link_element:
                    title = title_element.get_text(strip=True)
                    date = date_element.get_text(strip=True)
                    link = base_url + link_element['href']

                    press_releases.append({'title': title, 'date': date, 'link': link})
        else:
            print("Press release table not found.")
    else:
        print(f"Failed to fetch the webpage: {page_url}. Status code: {response.status_code}")

    return press_releases

# Function to extract patents from PDF
def extract_patents_from_pdf(pdf_path, start_page, end_page):
    reader = PdfReader(pdf_path)
    extracted_data = []
    serial_number = 1

    for i in range(start_page - 1, end_page):
        page = reader.pages[i]
        page_text = page.extract_text()

        lines = page_text.split("\n")
        for line in lines:
            match = re.match(r'(\d+)\s+(.+?)\s+(.+?)\s+(\d{6,})\s+(\d{2}/\d{2}/\d{4})', line.strip())

            if match:
                serial_no = match.group(1)
                isro_centre_unit = match.group(2).strip()
                product_title = match.group(3).strip()
                patent_no = match.group(4).strip()
                date = match.group(5).strip()

                extracted_data.append({
                    "S.No": serial_no,
                    "ISRO Centre/Unit": isro_centre_unit,
                    "Product/Title": product_title,
                    "Patent No": patent_no,
                    "Date": date
                })
                serial_number += 1

    df = pd.DataFrame(extracted_data)
    return df

# Function to return historical data (static for ISRO)
def get_isro_history():
    extended_isro_history = """
    1. Formation of ISRO (1969): ISRO was established on August 15, 1969...
    2. First Satellite (Aryabhata, 1975): India launched its first satellite...
    ...
    """
    return extended_isro_history



@app.route('/india/data/<section>', methods=['GET'])
def india_data(section):
    if section == 'press_releases':
        # Call your scrape function here
        press_releases = scrape_page(f"{base_url}/Press.html")
        return jsonify(press_releases)
    elif section == 'patents':
        # Extract patent data from the PDF
        pdf_path = "C:/Users/Ashutosh/Desktop/New folder (2)/ISROIPRApril2024.pdf"
        df_patents = extract_patents_from_pdf(pdf_path, 4, 24)
        return jsonify(df_patents.to_dict(orient='records'))
    elif section == 'history':
        # Return historical data as JSON
        history = get_isro_history()
        return jsonify({'history': history})
    else:
        return jsonify({'error': 'Section not found'}), 404



if __name__ == '__main__':
    app.run(debug=True)

