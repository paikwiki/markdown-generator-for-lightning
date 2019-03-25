const GetPaddedNumber = (number, digitFormat) => {
  const numText = typeof number === 'number' ? String(number) : number;
  if (numText.length > digitFormat.length) {
    return numText;
  }
  return `${digitFormat.slice(0, digitFormat.length - numText.length)}${numText}`;
};

export default GetPaddedNumber;
