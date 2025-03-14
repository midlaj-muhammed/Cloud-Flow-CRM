import OpenAI from "openai";

// Create an OpenAI API client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateCustomerInsights(customerData: any) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a CRM assistant that provides insights about customers based on their data and interaction history.",
        },
        {
          role: "user",
          content: `Provide brief insights about this customer: ${JSON.stringify(customerData)}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error generating customer insights:", error);
    return "Unable to generate insights at this time.";
  }
}

export async function suggestFollowUpTasks(
  customerData: any,
  interactionHistory: any,
) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a CRM assistant that suggests follow-up tasks based on customer data and interaction history.",
        },
        {
          role: "user",
          content: `Suggest 1-2 follow-up tasks for this customer based on their data and interaction history: Customer: ${JSON.stringify(customerData)}, Interaction History: ${JSON.stringify(interactionHistory)}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error suggesting follow-up tasks:", error);
    return "Unable to suggest follow-up tasks at this time.";
  }
}

export async function summarizeInteraction(interactionDetails: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a CRM assistant that summarizes customer interactions into brief, actionable points.",
        },
        {
          role: "user",
          content: `Summarize this customer interaction into 2-3 key points: ${interactionDetails}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error summarizing interaction:", error);
    return "Unable to summarize interaction at this time.";
  }
}
