import { saveAs } from 'file-saver'

export function checkSimilarity(text1, text2){
  return similarity(text1, text2);
}

function similarity(s1, s2) {
  let longer = s1;
  let shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  let longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  let costs = new Array();
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

export function savePdf(fileByte) {

  const bytes = new Uint8Array(fileByte);

  const pdfBlob = new Blob([bytes], {type: "application/pdf"});

  saveAs(pdfBlob, 'CV.pdf');


    // try {
    //   BACKEND.post('/fetchCreatedPdf', {employeeId: candidate.employee._id, CVid: candidate.CV._id}, { responseType: 'blob' }).then(response => {
            
    //     if(response.data instanceof Blob) {
    //       const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
  
    //       saveAs(pdfBlob, 'CV.pdf');
    //     } else {
    //       alertify.error('Не вдалося отримати файл');
    //       console.error(response);
    //     }
    //   });
    // } catch(error) {
    //   alertify.error('Не вдалося отримати файл');
    //   console.error(error);
    // }
}