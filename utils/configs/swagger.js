// config/swagger.js
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Authentication",
			version: "1.0.0",
			description: "Authenticate the user",
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
		servers: [
			{
				url: "http://localhost:5000",
				description: "Development server",
			},
			{
				url: "http://192.168.1.73:5000",
				description: "Development server",
			},
			{
				url: "http://192.168.1.58:5000",
				description: "Development server",
			},
			{
				url: "https://training-course-be.vercel.app",
				description: "Production server",
			},
		],
	},
	apis: ["./router/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
