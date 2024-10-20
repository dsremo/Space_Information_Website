const countries = [
    { name: 'India', sections: ['Events', 'Research Papers', 'Historical Work'] },
    { name: 'USA', sections: ['Events', 'Research Papers', 'Historical Work'] },
    { name: 'UK', sections: ['Events', 'Research Papers', 'Historical Work'] }
];


const fakeData = {
    'India': {
        'Events': [
            { title: 'Upcoming Space Exploration', description: 'India has a rich program of upcoming space exploration events, led by ISRO.' },
            { title: 'Gaganyaan Mission', description: 'India’s first manned space mission, planned by ISRO and set for launch in 2025.' },
            { title: 'Chandrayaan-3 Mission', description: 'A follow-up to the Chandrayaan-2 mission, Chandrayaan-3 aims to further explore the lunar surface.' },
            { title: 'PSLV-C56 Launch', description: 'The PSLV-C56 mission is a launch vehicle for deploying various satellites.' }
        ],
        'Research Papers': [
            { title: 'Recent Research', description: 'Recent papers focus on satellite communication and AI in space exploration.' },
            { title: 'Artificial Intelligence in Space', description: 'AI-driven autonomous satellite systems for real-time decision-making.' }
        ],
        'Historical Work': [
            { title: 'India’s Space History', description: 'Major milestones include Mangalyaan and the INSAT system.' },
            { title: 'Aryabhata', description: 'India’s first satellite launch in 1975 marked its entry into space exploration.' }
        ]
    },
    'USA': {
        'Events': [
            { title: 'Artemis Mission', description: 'NASA’s Artemis mission aims to return humans to the moon by 2025.' },
            { title: 'Mars 2026 Rover Mission', description: 'Building on Perseverance and Curiosity, to gather more samples.' }
        ],
        'Research Papers': [
            { title: 'Quantum Computing in Space', description: 'Exploring quantum computing for enhanced communication in space.' }
        ],
        'Historical Work': [
            { title: 'Apollo 11', description: 'The first successful manned mission to land on the moon in 1969.' },
            { title: 'Voyager Missions', description: 'The Voyager probes continue to explore the solar system and beyond.' }
        ]
    },
    'UK': {
        'Events': [
            { title: 'OneWeb Satellite Launch', description: 'OneWeb is preparing to launch another batch of satellites.' },
            { title: 'Virgin Galactic Commercial Spaceflight', description: 'Virgin Galactic is planning its first suborbital spaceflight for private individuals.' }
        ],
        'Research Papers': [
            { title: 'Sustainable Space Exploration', description: 'Developing sustainable technologies for space exploration.' }
        ],
        'Historical Work': [
            { title: 'Prospero Satellite', description: 'The UK’s Prospero satellite, launched in 1971, was the first designed and built by the country.' }
        ]
    }
};


const container = document.getElementById('dropdowns-container');
const contentDisplay = document.getElementById('content-display');
const searchBar = document.getElementById('search-bar');
const modal = document.getElementById('myModal');
const modalText = document.getElementById('modal-text');
const closeModal = document.getElementsByClassName('close')[0];


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

        link.addEventListener('click', function(event) {
            event.preventDefault();

           
            const selectedCountry = country.name;
            const selectedSection = section;

            
            const dataToDisplay = fakeData[selectedCountry][selectedSection];
            
            if (dataToDisplay && dataToDisplay.length > 0) {
                contentDisplay.innerHTML = `<h2>${selectedSection} for ${selectedCountry}</h2>`;
                dataToDisplay.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.classList.add('data-item');
                    itemElement.innerHTML = `<h3>${item.title}</h3><p>${item.description}</p>`;
                    contentDisplay.appendChild(itemElement);
                });
            } else {
                contentDisplay.innerHTML = `<h2>No data available for ${selectedSection} in ${selectedCountry}</h2>`;
            }
        });

        dropdownContent.appendChild(link);
    });

    dropdown.appendChild(button);
    dropdown.appendChild(dropdownContent);
    container.appendChild(dropdown);
});

searchBar.addEventListener('input', function () {
    const searchTerm = searchBar.value.toLowerCase();
    const allEvents = document.querySelectorAll('.data-item'); // Change to match your data items
    
    allEvents.forEach(event => {
        const text = event.innerText.toLowerCase();
        event.style.display = text.includes(searchTerm) ? 'block' : 'none';
    });
});


closeModal.onclick = function() {
    modal.style.display = 'none';
};

// Dark mode toggle
const toggleButton = document.getElementById('dark-mode-toggle');
toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});
