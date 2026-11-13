import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { MailDeliveryNotice } from "./MailDeliveryNotice.jsx";

it("identifica la demostración y permite abrir el buzón local sin afirmar entrega institucional", () => {
  render(<MailDeliveryNotice demoMail mailboxUrl="http://127.0.0.1:8025" />);
  expect(
    screen.getByRole("complementary", { name: "Correo de demostración" }),
  ).toHaveTextContent(
    "No llegan al correo real de ITESA ni acreditan su titularidad.",
  );
  expect(
    screen.getByRole("link", { name: "Abrir buzón de pruebas" }),
  ).toHaveAttribute("href", "http://127.0.0.1:8025");
  expect(screen.getByRole("link")).toHaveAttribute(
    "rel",
    "noopener noreferrer",
  );
});

it("no anuncia un buzón de demostración para el envío externo o deshabilitado", () => {
  render(<MailDeliveryNotice demoMail={false} />);
  expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
});
