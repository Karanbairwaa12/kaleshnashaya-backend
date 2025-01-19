const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: message }],
                max_tokens: 500
            })
        });

        const data = await response.json();

        if (!response.ok) {
            if (data.error?.code === 'insufficient_quota') {
                return res.status(403).send({
                    result: "Failed",
                    message: "You have exceeded your API quota. Please check your plan or reduce usage.",
                    error: data.error
                });
            }
            return res.status(response.status).send({
                result: "Failed",
                message: data.error?.message || "Unknown error occurred",
                error: data.error
            });
        }

        res.status(200).send({
            result: "Success",
            message: "Response generated successfully",
            data: data.choices[0].message.content
        });
    } catch (error) {
        res.status(500).send({
            result: "Failed",
            message: "Internal Server Error",
            error: error.message
        });
    }
};

  module.exports = {chatWithAI}