const countries = [
    { name: 'India', sections: ['Events', 'Research Papers', 'Historical Work'] },
    { name: 'USA', sections: ['Events', 'Research Papers', 'Historical Work'] },
    { name: 'UK', sections: ['Events', 'Research Papers', 'Historical Work'] }
];

// Placeholder for dynamic data
const fakeData = {
    'India': {
        'Events': [
            { title: 'Gaganyaan Mission', description: 'India’s first manned space mission is set for 2025.' },
            { title: 'Chandrayaan-3 Success', description: 'A follow-up lunar mission achieving a historic landing.' },
        ],
        'Research Papers': [
            { title: 'ISRO Research on Space Weather', description: 'An analysis of space weather and its implications.' }
        ],
        'Historical Work': [
            { title: 'Aryabhata Satellite', description: 'India’s first satellite, launched in 1975.' }
        ]
    },
    'USA': {
        'Events': [
            { title: 'Artemis II Mission', description: 'The next step in NASA’s return to the moon.' },
        ],
    },
    'UK': {
        'Research Papers': [
            { title: 'UK’s Mars Rover Study', description: 'Breakthrough in Mars exploration technologies.' },
        ]
    }
};

// Elements
const dropdownContainer = document.getElementById('dropdowns-container');
const contentDisplay = document.getElementById('content-display');
const searchBar = document.getElementById('search-bar');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const mediaContainer = document.getElementById('media-container');

// NASA API Integration
const nasaApiKey = 'sF6PQe5TD5h4JDb96qnU3Ajf5uncCuHTiaZCc4ZE';
const nasaApiUrl = `https://api.nasa.gov/planetary/apod?api_key=${nasaApiKey}`;

// Function to populate content when a section is clicked
function displayData(section) {
    const contentDisplay = document.getElementById('content-display');
    contentDisplay.innerHTML = `<h2>${section} for India</h2>`;
    
    const data = indiaData[section];
    if (data) {
        data.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('data-item');
            itemElement.innerHTML = `<h3>${item.title}</h3><p>${item.description}</p>`;
            contentDisplay.appendChild(itemElement);
        });
    } else {
        contentDisplay.innerHTML += `<p>No data available for ${section} in India.</p>`;
    }
}

// Function to fetch data based on the section clicked
async function fetchData(section) {
    try {
        const response = await fetch(`/india/data/${section}`);
        const data = await response.json();

        if (section === 'press_releases') {
            displayPressReleases(data);
        } else if (section === 'patents') {
            displayPatents(data);
        } else if (section === 'history') {
            displayHistory(data);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Display press releases
function displayPressReleases(data) {
    const list = document.getElementById('press-releases-list');
    list.innerHTML = '';  // Clear any previous content
    if (data && data.length) {
        data.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<a href="${item.link}">${item.title}</a> - ${item.date}`;
            list.appendChild(listItem);
        });
    } else {
        list.innerHTML = '<li>No press releases available.</li>';
    }
}

// Display patents
function displayPatents(data) {
    const table = document.getElementById('patents-table');
    table.innerHTML = '';  // Clear the table
    if (data && data.length) {
        data.forEach(item => {
            const row = table.insertRow();
            Object.values(item).forEach(val => {
                const cell = row.insertCell();
                cell.textContent = val;
            });
        });
    } else {
        table.innerHTML = '<tr><td colspan="5">No patents found.</td></tr>';
    }
}

// Display history
function displayHistory(data) {
    const historyElement = document.getElementById('history');
    if (data && data.history) {
        historyElement.textContent = data.history;
    } else {
        historyElement.textContent = 'No historical data available.';
    }
}

// Add event listeners to links
document.getElementById('events-link').addEventListener('click', (e) => {
    e.preventDefault();  // Prevent default link behavior
    fetchData('press_releases');  // Fetch press releases data
});

document.getElementById('patents-link').addEventListener('click', (e) => {
    e.preventDefault();
    fetchData('patents');  // Fetch patents data
});

document.getElementById('history-link').addEventListener('click', (e) => {
    e.preventDefault();
    fetchData('history');  // Fetch history data
});


// Helper function to extract YouTube video ID from URL
function getYouTubeVideoId(url) {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
}

// Call the NASA API on page load
fetchNasaApod();

// Populate dropdowns
countries.forEach(country => {
    const dropdown = document.createElement('div');
    dropdown.className = 'dropdown';

    const button = document.createElement('button');
    button.className = 'dropbtn';
    button.innerText = country.name;

    const dropdownContent = document.createElement('div');
    dropdownContent.className = 'dropdown-content';

    country.sections.forEach(section => {
        const link = document.createElement('a');
        link.href = `#${section.toLowerCase().replace(' ', '-')}`;
        link.innerText = section;

        link.addEventListener('click', event => {
            event.preventDefault();
            const selectedCountry = country.name;
            const selectedSection = section;

            // Update content display
            const dataToDisplay = fakeData[selectedCountry]?.[selectedSection];
            contentDisplay.innerHTML = `<h2>${section} for ${selectedCountry}</h2>`;
            if (dataToDisplay) {
                dataToDisplay.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.classList.add('data-item');
                    itemElement.innerHTML = `<h3>${item.title}</h3><p>${item.description}</p>`;
                    contentDisplay.appendChild(itemElement);
                });
            } else {
                contentDisplay.innerHTML += `<p>No data available for ${section} in ${selectedCountry}.</p>`;
            }
        });

        dropdownContent.appendChild(link);
    });

    dropdown.appendChild(button);
    dropdown.appendChild(dropdownContent);
    dropdownContainer.appendChild(dropdown);
});

// Search Bar Filter
searchBar.addEventListener('input', function () {
    const searchTerm = searchBar.value.toLowerCase();
    const allItems = document.querySelectorAll('.data-item');
    allItems.forEach(item => {
        const text = item.innerText.toLowerCase();
        item.style.display = text.includes(searchTerm) ? 'block' : 'none';
    });
});

// Event Listeners for Section Links
document.getElementById('events-link').addEventListener('click', () => fetchData('press_releases'));
document.getElementById('patents-link').addEventListener('click', () => fetchData('patents'));
document.getElementById('history-link').addEventListener('click', () => fetchData('history'));


// Dark Mode Toggle
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

document.addEventListener("DOMContentLoaded", function() {
    // Achievements of India in Space
    const achievements = [
        { title: "Chandrayaan-1", detail: "India's first lunar probe that helped confirm the presence of water on the Moon." },
        { title: "Mangalyaan (Mars Orbiter Mission)", detail: "India's first interplanetary mission to Mars, which made India the first country to reach Mars on its first attempt." },
        { title: "Chandrayaan-2", detail: "India's second lunar mission with an orbiter, lander (Vikram), and rover (Pragyan)." },
        { title: "PSLV-C37", detail: "India launched 104 satellites in one go, a world record for a single launch." },
        { title: "Gaganyaan", detail: "India's first manned space mission planned to send astronauts to space." },
        { title: "INSAT Series", detail: "India’s series of communication satellites that have significantly advanced India’s space technology." },
        { title: "GSAT", detail: "India's series of communication satellites used for a variety of applications including telecommunications, broadcasting, and weather forecasting." }
    ];

    // Get the container for displaying achievements
    const achievementsContainer = document.getElementById('achievements-list');

    // Display the achievements
    achievements.forEach(achievement => {
        const achievementItem = document.createElement('div');
        achievementItem.classList.add('achievement');
        achievementItem.innerHTML = `<strong>${achievement.title}</strong>: ${achievement.detail}`;
        achievementsContainer.appendChild(achievementItem);
    });

    // Fetch NASA's Image/Video of the Day (Placeholder Example)
    const mediaContainer = document.getElementById('media-container');
    fetch('https://api.nasa.gov/planetary/apod?api_key=sF6PQe5TD5h4JDb96qnU3Ajf5uncCuHTiaZCc4ZE')
        .then(response => response.json())
        .then(data => {
            if (data.media_type === 'image') {
                mediaContainer.innerHTML = `<img src="${data.url}" alt="NASA Image of the Day">`;
            } else if (data.media_type === 'video') {
                mediaContainer.innerHTML = `<iframe width="100%" height="315" src="${data.url}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            }
        })
        .catch(error => {
            mediaContainer.innerHTML = "<p>Unable to fetch NASA data at this time.</p>";
        });
});
