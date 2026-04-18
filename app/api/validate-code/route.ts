import { NextRequest, NextResponse } from "next/server";
import { getServerSideConfig } from "../../config/server";
import md5 from "spark-md5";

const VALIDATED_CODE_KEY = "nextchat_validated_code";

function getCodeHash(code: string): string {
  return md5.hash(code.trim()).trim();
}

async function handle(req: NextRequest) {
  const serverConfig = getServerSideConfig();

  // If CODE is not configured, allow access
  if (!serverConfig.needCode) {
    return NextResponse.json({ valid: true });
  }

  try {
    const body = await req.json();
    const { code, token } = body;

    // If client sends a token for validation (re-validation on page load)
    if (token) {
      const isValidToken = serverConfig.codes.has(token);
      if (isValidToken) {
        return NextResponse.json({ valid: true });
      }
      return NextResponse.json(
        { valid: false, error: "Token expired" } as any,
        {
          status: 401,
        },
      );
    }

    // Otherwise, validate the code
    if (!code) {
      return NextResponse.json(
        { valid: false, error: "Code is required" },
        { status: 400 },
      );
    }

    const hashedCode = getCodeHash(code);

    // Check if the code matches any valid code
    const isValid = serverConfig.codes.has(hashedCode);

    if (isValid) {
      // Return the code hash as a validation token
      // The client will store this in localStorage
      return NextResponse.json({
        valid: true,
        token: hashedCode,
      });
    }

    return NextResponse.json({ valid: false, error: "验证码错误" } as any, {
      status: 401,
    });
  } catch (e) {
    return NextResponse.json(
      { valid: false, error: "Invalid request" },
      { status: 400 },
    );
  }
}

export const POST = handle;
export const runtime = "edge";
