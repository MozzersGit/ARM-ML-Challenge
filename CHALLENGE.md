# ML Model Integration Challenge

## Challenge
Create a simple code analysis tool that leverages a machine learning model to enhance the development experience. We encourage you to work within the constraints of your existing hardware - there's no need for specialised ML hardware or cloud compute resources. Your solution will be evaluated based on its implementation quality and design choices, not the size or capabilities of the underlying model.

Your tool should:

1. Accept a code snippet as input (any programming language)
2. Use an ML model to perform ONE of these tasks (your choice):
   * Generate unit tests for the code
   * Identify potential security vulnerabilities
   * Suggest code optimisations
   * Explain complex sections of the code
   * Convert the code to another programming language

## Implementation Approaches
You may choose any of these approaches:

### Local Model Deployment
There are a number of popular tools which allow you to run open-source models locally on your development machine. This approach gives you full control over the model and eliminates API dependencies. These tools support various model sizes - feel free to use smaller, more efficient models that run well on your hardware.

### API Integration
Services like OpenAI, Anthropic, or HuggingFace provide API access to state-of-the-art models. Many offer free tiers for development. This approach simplifies deployment but requires API key management.

Choose the approach that best matches your experience and interests. All approaches are equally valid for this challenge.

## Requirements
* The solution should be runnable on standard developer hardware (laptops, desktops)
* Choose model sizes and approaches that work well on your available hardware - smaller, more efficient models are perfectly acceptable
* Include basic error handling for common failure modes (model unavailable, rate limiting, etc.)

## Bonus Areas (time permitting)
* Implement a simple way to measure and display model latency/performance
* Caching of results to improve performance
* Model output validation or filtering
* Support for different model backends
* Integration with a code editor or IDE
* Support for multiple file analysis

## What We're Looking For
* Understanding of ML model deployment considerations
* Clean code organisation and error handling
* Thoughtful UI/UX decisions
* Documentation of design choices and trade-offs

## Time Limit
Please limit your work to 2 hours. We understand this constraint means making trade-offs - be prepared to discuss what you prioritised and why.

## Submission Requirements
Please include:
* Source code and setup instructions
* A README.md explaining:
  * How to run the solution
  * Your design decisions and trade-offs
  * What you would improve with more time
  * Any assumptions made
* If using API services, example API keys or instructions for obtaining them

## Evaluation Criteria
* Code quality and organisation
* Thoughtfulness of ML integration approach
* Documentation clarity
* Error handling and user experience
* Discussion of trade-offs and future improvements

## Platform Support
We want to be able to run your solution, so please ensure it works on one of the major OSes:
* Windows
* macOS (Apple Silicon)
* Linux

Please specify any platform-specific requirements or limitations in your documentation.