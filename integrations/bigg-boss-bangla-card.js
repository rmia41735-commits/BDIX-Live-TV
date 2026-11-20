/** Bigg Boss Bangla offline card. No remote stream scraping or token handling. */
export function renderBiggBossBanglaCard(mount, channel, { onSelect } = {}) {
  if (!(mount instanceof Element)) throw new TypeError("A mount element is required");
  const card = document.createElement("article");
  card.className = "bigg-boss-channel";
  card.setAttribute("aria-label", channel.name || "Bigg Boss Bangla");
  const title = document.createElement("h3");
  title.textContent = channel.name || "Bigg Boss Bangla";
  const badge = document.createElement("span");
  badge.className = "bigg-boss-status";
  const active = channel.enabled === true && channel.status === "online" &&
    typeof channel.streamUrl === "string" && /^https:\/\//i.test(channel.streamUrl);
  badge.textContent = active ? "AVAILABLE" : "OFFLINE";
  const desc = document.createElement("p");
  desc.textContent = active ? "Authorized stream configured" : "সম্প্রচার বর্তমানে উপলব্ধ নয়";
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = active ? "Watch" : "Unavailable";
  button.disabled = !active;
  if (active) button.addEventListener("click", () => onSelect?.(channel));
  card.append(title, badge, desc, button);
  mount.replaceChildren(card);
  return card;
}
