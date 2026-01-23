// Utils/sendEmail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOtpEmail = async (to, otp) => {
    const mailOptions = {
        from: `"IGIDR Canteen" <${process.env.EMAIL_USER}>`,
        to,
        subject: "OTP for IGIDR-Canteen Guest Login",
        html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa; padding: 20px; margin: 0;">
            <div style="
                max-width: 600px;
                margin: 20px auto;
                background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 10px 25px rgba(0,0,0,0.08), 0 6px 10px rgba(0,0,0,0.04);
                border: 1px solid rgba(0, 51, 102, 0.1);
            ">

                <!-- Header -->
                <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px 25px; text-align: center; color: #ffffff; position: relative; overflow: hidden;">
                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.1; background-image: url('https://picsum.photos/seed/igidr-pattern/600/200.jpg'); background-size: cover;"></div>
                    <div style="position: relative; z-index: 1;">
                        <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 1.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">IGIDR</h1>
                        <p style="margin: 8px 0 0; font-size: 16px; color: #e0e0e0; font-weight: 300;">
                            Indira Gandhi Institute of Development Research
                        </p>
                    </div>
                </div>

                <!-- Body -->
                <div style="padding: 40px 35px; color: #333; position: relative;">
                    
                    <div style="position: relative; z-index: 1;">
                        <h2 style="margin-top: 0; color: #003366; font-size: 26px; font-weight: 600; margin-bottom: 20px;">OTP Verification</h2>
                        
                        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 15px;">Namaste <span style="font-weight: 600; color: #003366;">${to.split("@")[0]} &#x1F64F;</span>,</p>
                        
                        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">Use the following One-Time Password (OTP) to complete your login:</p>

                        <div style="text-align: center; margin: 35px 0; position: relative;">
                            <div style="position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, rgba(0, 51, 102, 0.1) 0%, rgba(0, 51, 102, 0.3) 50%, rgba(0, 51, 102, 0.1) 100%); transform: translateY(-50%);"></div>
                            <div style="position: relative; display: inline-block; margin:15px 0px;">
                                <span style="
                                    display: inline-block;
                                    background: linear-gradient(135deg, #f0f4f8 0%, #e6eef7 100%);
                                    padding: 20px 50px;
                                    font-size: 32px;
                                    font-weight: 700;
                                    letter-spacing: 5px;
                                    border-radius: 12px;
                                    color: #003366;
                                    border: 2px solid rgba(0, 51, 102, 0.2);
                                    box-shadow: 0 4px 15px rgba(0, 51, 102, 0.1);
                                    text-shadow: 0 1px 2px rgba(255,255,255,0.8);
                                    position: relative;
                                    z-index: 1;
                                ">
                                    ${otp}
                                </span>
                            </div>
                        </div>

                        <div style="background: rgba(0, 51, 102, 0.05); border-left: 4px solid #003366; padding: 15px 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                            <p style="margin: 0; font-size: 15px; color: #444;">
                                <i style="color: #003366; margin-right: 8px;">⏱</i> This OTP is valid for <strong style="color: #003366;">5 minutes</strong>.
                            </p>
                        </div>

                        <!-- Canteen Menu Section -->
                        <div style="margin: 35px 0; padding: 25px; background: linear-gradient(135deg, #f9fafb 0%, #f0f4f8 100%); border-radius: 12px; border: 1px solid rgba(0, 51, 102, 0.08);">
                            <h3 style="margin: 0 0 15px; color: #003366; font-size: 20px; font-weight: 600; display: flex; align-items: center;">
                                <span style="margin-right: 8px;">🍽️</span> Explore Our Canteen Menu
                            </h3>
                            <p style="margin: 0 0 20px; font-size: 15px; color: #555; line-height: 1.5;">
                                Discover our delicious food options, daily specials, and seasonal favorites. We offer a variety of cuisines to satisfy your taste buds!
                            </p>
                            
                            <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                                <div style="flex: 1; text-align: center; padding: 0 5px;">
                                    <div style="font-size: 24px; margin-bottom: 5px;">🍛</div>
                                    <div style="font-size: 13px; color: #666;">Indian</div>
                                </div>
                                <div style="flex: 1; text-align: center; padding: 0 5px;">
                                    <div style="font-size: 24px; margin-bottom: 5px;">🍜</div>
                                    <div style="font-size: 13px; color: #666;">Chinese</div>
                                </div>
                                <div style="flex: 1; text-align: center; padding: 0 5px;">
                                    <div style="font-size: 24px; margin-bottom: 5px;">🥗</div>
                                    <div style="font-size: 13px; color: #666;">Healthy</div>
                                </div>
                                <div style="flex: 1; text-align: center; padding: 0 5px;">
                                    <div style="font-size: 24px; margin-bottom: 5px;">🍰</div>
                                    <div style="font-size: 13px; color: #666;">Desserts</div>
                                </div>
                            </div>
                            
                            <div style="text-align: center;">
                                <a href="https://igidrcmp.netlify.app/" style="
                                    display: inline-block;
                                    background: linear-gradient(135deg, #003366 0%, #004080 100%);
                                    color: white;
                                    text-decoration: none;
                                    padding: 12px 25px;
                                    border-radius: 8px;
                                    font-weight: 600;
                                    font-size: 15px;
                                    box-shadow: 0 4px 10px rgba(0, 51, 102, 0.2);
                                    transition: all 0.3s ease;
                                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 12px rgba(0, 51, 102, 0.3)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 10px rgba(0, 51, 102, 0.2)'">
                                    View Full Menu
                                </a>
                            </div>
                        </div>

                        <p style="font-size: 15px; color: #666; margin-top: 25px; padding: 15px; background-color: #f9fafb; border-radius: 8px;">
                            <i style="color: #003366; margin-right: 8px;">ℹ️</i> If you did not request this login, you can safely ignore this email.
                        </p>

                        <div style="margin-top: 35px; padding-top: 25px; border-top: 1px solid rgba(0, 51, 102, 0.1);">
                            <p style="margin: 0; font-size: 16px; color: #555;">
                                With Thanks & Regards,<br>
                                <strong style="color: #003366; font-size: 18px;">IGIDR Canteen</strong>
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div style="
                    background: linear-gradient(135deg, #f5f7fa 0%, #eef2f7 100%);
                    padding: 20px;
                    text-align: center;
                    font-size: 13px;
                    color: #666;
                    border-top: 1px solid rgba(0, 51, 102, 0.1);
                ">
                    <div style="margin-top: 10px; font-size: 12px;">
                        © ${new Date().getFullYear()} Indira Gandhi Institute of Development Research | All rights reserved
                    </div>
                </div>
            </div>
        </div>
        `,
        text: `Your OTP is ${otp}. It is valid for 5 minutes.\n\nExplore our canteen menu at: https://igidrcmp.netlify.app/`
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendOtpEmail;