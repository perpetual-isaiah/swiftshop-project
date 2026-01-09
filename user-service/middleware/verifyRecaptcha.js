const verifyRecaptcha = async (req, res, next) => {
  try {
    const token = req.body?.recaptchaToken;

    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Please complete the reCAPTCHA." });
    }

    if (!process.env.RECAPTCHA_SECRET_KEY) {
      console.error("Missing RECAPTCHA_SECRET_KEY in user-service .env");
      return res
        .status(500)
        .json({ success: false, message: "Server misconfigured (reCAPTCHA)." });
    }

    const params = new URLSearchParams();
    params.append("secret", process.env.RECAPTCHA_SECRET_KEY);
    params.append("response", token);

    const resp = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const data = await resp.json();

    if (!data?.success) {
      return res.status(400).json({
        success: false,
        message: "reCAPTCHA verification failed.",
        recaptchaErrors: data?.["error-codes"] || [],
      });
    }

    next();
  } catch (err) {
    console.error("verifyRecaptcha error:", err);
    return res
      .status(500)
      .json({ success: false, message: "reCAPTCHA verification error." });
  }
};

module.exports = verifyRecaptcha;
