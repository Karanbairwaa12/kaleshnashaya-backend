const findHighestId = (arr) => {
	let id = 0;
	arr.forEach((item) => {
		if (item.id > id) {
			id = item.id;
		}
	});

	return id === 0 ? 1 : id;
};
const mailUI = `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f9f9f9; border-radius: 10px; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #d9534f; font-size: 24px;">Termination of Participation</h1>
        <p style="font-size: 16px;">Dear User,</p>
        <p style="font-size: 16px;">
            After careful review of your participation and progress in our program, we regret to inform you that your current enrollment is being terminated. Despite multiple attempts, the necessary requirements and expectations have not been met.
        </p>
        <p style="font-size: 16px;">
           We understand that learning can come with challenges, and we encourage you to take time to reflect on the areas that proved difficult. This experience is not the end of your learning journey, but rather an opportunity for growth and improvement.
        </p>
        <p style="font-size: 16px;">
          We wish you the very best in your future endeavors.
        </p>
        <p style="font-size: 16px;">Good luck... you'll need it.</p>
        <p style="font-size: 16px;">Sincerely,</p>
        <p style="font-size: 16px;">The Program Team</p>
        <footer style="margin-top: 20px; border-top: 1px solid #ccc; padding-top: 10px;">
            <p style="font-size: 12px; color: #999;">
                This is an automated message, please do not reply.
            </p>
        </footer>
    </div>
`;

const verifyEmail = async (email) => {
	try {
	  const response = await fetch(
		`https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&email=${email}`
	  );
	  const data = await response.json();
	  
	  // Check if email is deliverable and has valid mailbox
	  return {
		isValid: data.deliverability === "DELIVERABLE" && 
				 data.is_valid_format.value && 
				 !data.is_disposable_email.value,
		reason: data.deliverability !== "DELIVERABLE" ? "Email address doesn't exist" :
				!data.is_valid_format.value ? "Invalid email format" :
				data.is_disposable_email.value ? "Disposable emails not allowed" : null
	  };
	} catch (error) {
	  console.error('Email verification error:', error);
	  throw new Error('Email verification failed');
	}
  };

module.exports = { findHighestId, mailUI, verifyEmail };
