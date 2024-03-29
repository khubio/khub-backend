const generateCode = (length) => {
  return Array(length)
    .fill('x')
    .join('')
    .replace(/x/g, () => {
      return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    });
};

module.exports = generateCode;
