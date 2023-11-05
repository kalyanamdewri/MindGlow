document.addEventListener("DOMContentLoaded", function() {
    const storiesContainer = document.querySelector('.stories');
    const submitButton = document.createElement('button');
    const toggleButton = document.createElement('button');
    const storyInput = document.createElement('textarea');
    
    // Setup the textarea for TinyMCE
    storyInput.id = 'storyEditor';  // Added this line
    storyInput.placeholder = 'Share your story...';
    storyInput.style.width = '100%';
    storyInput.style.height = '100px';
    storyInput.style.marginBottom = '10px';
    
    // Setup the submit button
    submitButton.textContent = 'Submit Your Story';
    submitButton.style.marginRight = '10px';

    // Setup the toggle button
    toggleButton.textContent = 'Hide Stories';
    let areStoriesVisible = true;

    // Add the textarea and buttons to the page
    document.body.insertBefore(storyInput, storiesContainer);
    document.body.insertBefore(submitButton, storiesContainer);
    document.body.insertBefore(toggleButton, storiesContainer);

    const API_KEY = "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"; //replace this with your actual OpenAI API key


    // Initialize TinyMCE on the textarea
    tinymce.init({
        selector: '#storyEditor',
        plugins: 'ChatGPT textcolor link lists image editimage',
        toolbar: 'forecolor backcolor link numlist bullist editimage rotateleft rotateright flipv fliph aidialog aishortcuts',
        editimage_proxy_service_url: "https://cors-anywhere.herokuapp.com/",
    });
    

    submitButton.addEventListener('click', function() {
        const storyContent = tinymce.get("storyEditor").getContent();
        if(storyContent.trim() !== "") {
            
            // Send the story to the server for processing with ChatGPT
            const openAiOptions = {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${API_KEY}`
                }, 
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo', 
                    temperature: 0.7, 
                    max_tokens: 800, 
                    messages: [
                        {
                            role: 'user', 
                            content: storyContent
                        }
                    ]
                })
            }; 
            
            fetch('https://api.openai.com/v1/chat/completions', openAiOptions)
            
            .then(response => response.json())
            .then(data => {
                const enhancedStory = data.choices[0].message.content.trim();

                addStory(enhancedStory);
                tinymce.get("storyEditor").setContent("");
            })
            .catch(error => {
                console.error('Error:', error);
                alert("There was an error processing your story. Please try again later.");
            });
    
        } else {
            alert("Please enter a story before submitting!");
        }
    });
    

    toggleButton.addEventListener('click', function() {
        const storiesArticles = document.querySelectorAll("#stories article");
        storiesArticles.forEach(story => {
            if (story.style.display !== "none") {
                story.style.display = "none";
            } else {
                story.style.display = "block";
            }
        });
        // Toggle the button text and state
        if (areStoriesVisible) {
            toggleButton.textContent = 'Show Stories';
            areStoriesVisible = false;
        } else {
            toggleButton.textContent = 'Hide Stories';
            areStoriesVisible = true;
        }
    });

    // Function to add stories dynamically
    function addStory(content) {
        const storyElement = document.createElement('article');
        storyElement.innerHTML = `
            <h3>Anonymous's Journey</h3>
            <p>${content}</p>
        `;
        storiesContainer.appendChild(storyElement);
    }
});
