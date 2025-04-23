const matrix = [];

exports.addMatrix = (name, age) => {
    matrix.push({ name, age });
};

exports.getMatrix = () => matrix.slice();