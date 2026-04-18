"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./code-gate.module.scss";
import { IconButton } from "./button";
import Locale from "../locales";
import BotIcon from "../icons/bot.svg";
import { safeLocalStorage } from "../utils";
import clsx from "clsx";

const storage = safeLocalStorage();

// Keys for localStorage
const VALIDATED_TOKEN_KEY = "nextchat_validated_token";

interface CodeGateProps {
  onSuccess?: () => void;
  onSkip?: () => void;
}

export function CodeGate(props: CodeGateProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [needCode, setNeedCode] = useState(true);

  // Check localStorage on mount
  useEffect(() => {
    const checkValidation = async () => {
      const storedToken = storage.getItem(VALIDATED_TOKEN_KEY);

      // First check if CODE is required
      try {
        const res = await fetch("/api/config", { method: "GET" });
        const config = await res.json();

        // If CODE is not required, skip gate
        if (!config.needCode) {
          setNeedCode(false);
          props.onSkip?.();
          return;
        }

        // If we have a token stored, validate it with server
        if (storedToken) {
          const validateRes = await fetch("/api/validate-code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: storedToken }),
          });

          const data = await validateRes.json();
          if (data.valid) {
            // Token is valid, skip gate
            setNeedCode(false);
            props.onSkip?.();
            return;
          } else {
            // Token is invalid (CODE may have changed), clear it
            storage.removeItem(VALIDATED_TOKEN_KEY);
          }
        }
      } catch (e) {
        console.error("[CodeGate] Failed to check validation:", e);
      }

      // Show the gate
      setNeedCode(true);
    };

    checkValidation();
  }, [props]);

  const handleSubmit = useCallback(async () => {
    if (!code.trim()) {
      setError(Locale.Auth.Tips);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/validate-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json();

      if (data.valid && data.token) {
        // Store the validation token
        storage.setItem(VALIDATED_TOKEN_KEY, data.token);
        setNeedCode(false);
        props.onSuccess?.();
      } else {
        setError(data.error || "Invalid access code");
      }
    } catch (e) {
      console.error("[CodeGate] Validation failed:", e);
      setError("Validation failed, please try again");
    } finally {
      setIsLoading(false);
    }
  }, [code, props]);

  // Handle keyboard submit
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit();
    }
  };

  if (!needCode) {
    return null;
  }

  return (
    <div className={styles["code-gate"]}>
      <div className={styles["code-gate-content"]}>
        <div className={clsx("no-dark", styles.logo)}>
          <BotIcon />
        </div>

        <div className={styles.title}>{Locale.Auth.Title}</div>
        <div className={styles.tips}>{Locale.Auth.Tips}</div>

        <div className={styles.input}>
          <input
            type="text"
            className={styles.codeInput}
            placeholder={Locale.Auth.Input}
            value={code}
            onChange={(e) => {
              setCode(e.currentTarget.value);
              if (error) setError("");
            }}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.actions}>
          <IconButton
            text={Locale.Auth.Confirm}
            type="primary"
            onClick={handleSubmit}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
