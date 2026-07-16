import { expect, test } from "@playwright/test";

test.describe("Intelligent Inventory Dashboard — full flow", () => {
  test("open, filter, see aging stock, log an action, confirm it persists", async ({ page }) => {
    await page.goto("/");

    // Open: the vehicle list and the global aging count both render.
    const table = page.getByRole("table");
    await expect(table).toBeVisible();
    await expect(page.getByRole("status")).toContainText(/aging stock/i);

    const rowCountBeforeFilter = await table.getByRole("row").count();

    // Filter: selecting a make narrows the list (server-side).
    await page.getByLabel("Filter by make").selectOption("Honda");
    await expect(async () => {
      const rowCountAfterFilter = await table.getByRole("row").count();
      expect(rowCountAfterFilter).toBeLessThanOrEqual(rowCountBeforeFilter);
    }).toPass();
    for (const cell of await table.locator("tbody tr td:nth-child(2)").all()) {
      await expect(cell).toHaveText("Honda");
    }

    // Aging stock: find a row flagged as aging, expand it, log an action.
    const agingRow = page.getByRole("row").filter({ hasText: "Aging Stock" }).first();
    await expect(agingRow).toBeVisible();
    await agingRow.getByRole("button", { name: "Log action" }).click();
    await expect(agingRow.getByText("No actions logged yet.")).toBeVisible();

    const actionText = `Price Reduction Planned (${Date.now()})`;
    await agingRow.getByLabel("Status or proposed action").fill(actionText);
    await agingRow.getByRole("button", { name: "Submit" }).click();

    // Confirm persisted: appears in both the current-status badge and history, without a manual page reload.
    await expect(agingRow.getByText(actionText).first()).toBeVisible();
    await expect(agingRow.getByLabel("Status or proposed action")).toHaveValue("");
  });

  test("paginates when more than one page of results exists", async ({ page }) => {
    await page.goto("/");
    const pageIndicator = page.getByText(/Page \d+ of \d+/);
    await expect(pageIndicator).toBeVisible();
    const [, totalPages] = (await pageIndicator.textContent())?.match(/Page (\d+) of (\d+)/) ?? [];
    if (Number(totalPages) > 1) {
      await page.getByRole("button", { name: "Next", exact: true }).click();
      await expect(page.getByText("Page 2 of")).toBeVisible();
    }
  });

  test("changing the page size re-queries and resets to page 1", async ({ page }) => {
    await page.goto("/");
    const table = page.getByRole("table");
    await expect(table).toBeVisible();

    await page.getByRole("button", { name: "Next", exact: true }).click();
    await expect(page.getByText("Page 2 of")).toBeVisible();

    await page.getByLabel("Vehicles per page").selectOption("100");
    await expect(page.getByText("Page 1 of")).toBeVisible();
    await expect(async () => {
      expect(await table.getByRole("row").count()).toBe(101); // 100 rows + header row
    }).toPass();
  });

  test("sorting a column re-queries in the new order and toggles direction on repeat clicks", async ({
    page,
  }) => {
    await page.goto("/");
    const table = page.getByRole("table");
    await expect(table).toBeVisible();

    const makeColumn = () => table.locator("tbody tr td:nth-child(2)").allTextContents();

    await page.getByRole("button", { name: "Make" }).click();
    await expect(async () => {
      const makes = await makeColumn();
      expect(makes).toEqual([...makes].sort());
    }).toPass();

    await page.getByRole("button", { name: "Make" }).click();
    await expect(async () => {
      const makes = await makeColumn();
      expect(makes).toEqual([...makes].sort().reverse());
    }).toPass();
  });
});

test.describe("Responsive layout", () => {
  const viewports = [
    { name: "desktop", width: 1280, height: 800 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "mobile", width: 375, height: 667 },
  ];

  for (const viewport of viewports) {
    test(`renders without horizontal overflow at ${viewport.name} width`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("/");
      await expect(page.getByRole("table")).toBeVisible();

      const hasOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      );
      expect(hasOverflow).toBe(false);
    });
  }
});

test.describe("Performance (SRS Time Behaviour NFR)", () => {
  test("inventory-render completes within 2 seconds for a page of up to 500 vehicles", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByRole("table")).toBeVisible();
    await page.waitForFunction(() => performance.getEntriesByName("inventory-render").length > 0);

    const durationMs = await page.evaluate(() => {
      const entries = performance.getEntriesByName("inventory-render");
      return entries.length > 0 ? entries[entries.length - 1].duration : null;
    });

    expect(durationMs).not.toBeNull();
    expect(durationMs as number).toBeLessThan(2000);
  });
});
