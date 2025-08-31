# Maurice's ML Integration Challenge Solution

This repository contains my solution for the ML Model Integration Challenge. The goal of this challenge was to create a simple code analysis tool that leverages a machine learning model to enhance the development experience. I chose to implement a tool that suggests code optimisations using an API integration approach.



---

## Table of Contents
- [Maurice's ML Integration Challenge Solution](#maurices-ml-integration-challenge-solution)
  - [Table of Contents](#table-of-contents)
  - [How to Run the Solution](#how-to-run-the-solution)
    - [OpenAI API Key Instructions](#openai-api-key-instructions)
  - [Design Decisions and Trade-offs](#design-decisions-and-trade-offs)
    - [Bonus requirements](#bonus-requirements)
      - [Model Lantency](#model-lantency)
      - [IDE Integration](#ide-integration)
  - [Improvements](#improvements)
    - [UI](#ui)
    - [Backend](#backend)
  - [Assumptions](#assumptions)

---

## How to Run the Solution

1. Prequisites:

- Python 3.12 or higher (Developed on 3.12.8)
- pip (Python package installer) installed locally
- An OpenAI API key (see instructions below)
- NPM and Node.js installed locally (Developed on Node.js v22.13.0 and NPM v10.9.2)

### OpenAI API Key Instructions
You can obtain an account firstly by signing up at [OpenAI](https://platform.openai.com/signup)
Once signed up, navigate to [OpenAI API Keys](https://platform.openai.com/api-keys) and create a new secret key.

2. Clone the repository:

```bash
git clone
cd 

# Setup environment variables
touch .env  
echo "OPENAI_API_KEY=your_openai_api_key_here" >> .env
```

3. Install and setup dependencies:

```bash
npm i
npm run setup-backend # Installs UV/ Sets up virtual environment/ Installs dependencies
```

4. Run the application (non-development mode):

```bash
npm run build
npm run start
```


## Design Decisions and Trade-offs

My approach with this solution, was to spend a lot of time planning and derisking my solution, then make the most of the limited time (during the programming and build phase) and increase my productivity by using AI powered tooling (Cursor/ChatGPT).

My approach to this challenge was that I wanted a high quality and well written software which addressed several but not all of the bonus requirements, but had the potential, with very little extra work to meet all the requirements, showing forward thinking, and also allowing me to easily hit more bonus requirements if my time spent proved to be more productive than expected.

I used OpenAI's API, for simplicity, easier prompt engineering with more powerful models (such as the new GPT-5), documentation and local hardware limitations.

I chose the Complexity Analysis, as I believe it was one of the simplest challenges, allowing me to make more during the implementation phase.

### Bonus requirements

My solution implements:

 - Simple File based caching
 - Model Output Validation (using OpenAI's library and suggested implementation)
 - Support for different model backends (factory method)
 - Multiple File Analysis (currently in individual contexts)

I was not able to implement:
 - Model Lantency/Performance
 - IDE Integration

My implementaion was designed in a way, where could be implemented simply

#### Model Lantency

By using a simple FastAPI middleware, time taken for a response could give a simple latency and be added into a HTTP Header for the frontend to process and display

#### IDE Integration

By using a separated backend, another frontend could be implemented into an IDE, most likely a VSCode extension.
With support for line numbers already integrated, complex snippets could be highlighted to the user.


## Improvements

I very much enjoyed this challenge and my mind has been racing about other potential features and implementations. This project could expand into many different directions.
Some short/long term improvements would be:

### UI

- Line Numbers in Code Files.
- Navigate to Snippet (clicking on the snippets scrolls to the snippet within the code file).
- Highlight Lines with colours matching their complexity.
-  Better iterative flow on a files (rerunning analysis on changes while editing files)


###  Backend

- Shared multi-file analysis (instead of analysing 1 file at a time, analyse several files in the same prompt so the model has more context.)
- Offline Model fallback (when offline or on error)
- POML (Prompt Orchestration Markup Language)
- Segment Code into functions or relevant snippets then analyse (allows for better caching)
  - This could also encourage a more balanced response from the model
  - May also work better with less capable models
- Better HTTP API 
  - Fire off analysis task, then check in with its progress. 
  - Use openai completion websocket and attempt to parse snippets as they are generated.
  - More scalable caching strategy (in-memory cache, Redis etc.)


## Assumptions

my product makes the following assumptions:

- Internet Connected deployment
- Very linear workflow, assumes the user wants to analyse their code, see the results then done. Maybe not very helpful for a developer who is always iteratively improving their code.