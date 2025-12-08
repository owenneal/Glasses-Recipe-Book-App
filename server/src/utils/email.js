const nodemailer = require('nodemailer');

// Create reusable transporter
function createTransporter() {
    return nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
}

// Validate email domain
function isAllowedDomain(email) {
    const allowedDomains = (process.env.ALLOWED_EMAIL_DOMAINS || 'gmail.com,outlook.com,yahoo.com,ethereal.email')
        .split(',')
        .map(d => d.trim().toLowerCase());
    
    const domain = email.split('@')[1]?.toLowerCase();
    return allowedDomains.includes(domain);
}

// Format recipe for email
function formatRecipeEmail(recipe, senderName) {
    const ingredientsList = recipe.ingredients
        .map((ing, i) => `  ${i + 1}. ${ing}`)
        .join('\n');
    
    const instructionsList = recipe.instructions
        .map((step, i) => `  ${i + 1}. ${step}`)
        .join('\n\n');

    return `
Hello!

${senderName} has shared a recipe with you from the Recipe Collection App.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${recipe.title.toUpperCase()}

${recipe.averageRating > 0 ? `⭐ Rating: ${recipe.averageRating.toFixed(1)}/5 (${recipe.ratings?.length || 0} ratings)` : ''}

INGREDIENTS:
${ingredientsList}

INSTRUCTIONS:
${instructionsList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Enjoy cooking!

This recipe was shared via Recipe Collection App.
    `.trim();
}

// Send recipe email
async function sendRecipeEmail(recipe, recipientEmail, senderName) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        throw new Error('Email service not configured. Please set EMAIL_USER and EMAIL_PASSWORD environment variables.');
    }

    if (!isAllowedDomain(recipientEmail)) {
        throw new Error(`Email domain not allowed. Allowed domains: ${process.env.ALLOWED_EMAIL_DOMAINS || 'gmail.com,outlook.com,yahoo.com'}`);
    }

    const transporter = createTransporter();
    const emailBody = formatRecipeEmail(recipe, senderName);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: `${senderName} shared a recipe with you: ${recipe.title}`,
        text: emailBody
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
}

module.exports = {
    sendRecipeEmail,
    isAllowedDomain
};