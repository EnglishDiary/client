const commonUtils = {
    shuffleArray: (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },
    combineWords: (words, combineCount) => {
        return words.reduce((result, word, index) => {
            const groupIndex = Math.floor(index / combineCount);
            if (index % combineCount === 0) {
                result.push(word);
            } else {
                result[groupIndex] += ' ' + word;
            }
            return result;
        }, []);
    }


}

export { commonUtils }