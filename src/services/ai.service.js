const  { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

async function aimessage(data){
  try{

    const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: data,
  });
  
  return response.text
  }catch(err){
    console.log(err)
  }
}

module.exports=aimessage