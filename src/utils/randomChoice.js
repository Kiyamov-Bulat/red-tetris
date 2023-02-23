const randomChoice = (choices) => {
    return choices[Math.floor(Math.random() * choices.length)];
};

export default randomChoice;