const nodemailer = require('nodemailer');

async function createEtherealAccount() {
    try {
        // Generate test SMTP service account from ethereal.email
        const testAccount = await nodemailer.createTestAccount();

        console.log('\n=== Ethereal Email Test Account Created ===\n');
        console.log('Add these to your server/.env file:\n');
        console.log(`EMAIL_SERVICE=ethereal`);
        console.log(`EMAIL_USER=${testAccount.user}`);
        console.log(`EMAIL_PASSWORD=${testAccount.pass}`);
        console.log(`\nYou can view sent emails at: https://ethereal.email/messages`);
        console.log(`\nLogin credentials for Ethereal web interface:`);
        console.log(`Username: ${testAccount.user}`);
        console.log(`Password: ${testAccount.pass}`);
        console.log('\n==========================================\n');
    } catch (error) {
        console.error('Error creating Ethereal account:', error);
    }
}

createEtherealAccount();