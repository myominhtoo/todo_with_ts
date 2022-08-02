export const useConsole = () => {
    const log = (input) => {
        console.log(input);
    };
    return {
        log
    };
};
