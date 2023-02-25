export const formatDateString = (str) => {
    const date = str.split('T')[0].replaceAll('-', '.');
    let time = str.split('T')[1].split('+')[0];
    if (time.includes('.')) {
        time = time.split('.')[0];
    }

    return (date + ' ' + time);
};