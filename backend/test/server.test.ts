import Prisma from "../src/db";
import { server } from "../src/server";


/* Setup/tear-down*/

beforeAll(async () => {
  await Prisma.entry.deleteMany()
})

afterEach(async () => {
  await Prisma.entry.deleteMany();
});


/* Fetching entries*/

describe("GET /get/", () => {
  it("should assert that the fetched entries array is empty", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/get/",
    });
    expect(response.statusCode).toBe(200);

    const data = response.json()
    expect(data).toHaveLength(0);
  });
});

describe("GET /get/", () => {
  it("should return all entries in the database", async () => {
    const mockEntries = [
      { id: "1", title: "Test Entry 1", description: "Test Description 1", created_at: new Date(), scheduled: new Date("2025-02-02T00:00:00.000Z") },
      { id: "2", title: "Test Entry 2", description: "Test Description 2", created_at: new Date("2025-04-01T09:00:00.000Z"), scheduled: new Date("2025-04-02T09:00:00.000Z") },
    ];

    await Prisma.entry.create({data: mockEntries[0]})
    await Prisma.entry.create({data: mockEntries[1]})

    const response = await server.inject({
      method: "GET",
      url: "/get/",
    });

    const expectedEntries = mockEntries.map((entry) => ({
      ...entry,
      created_at: entry.created_at.toISOString(),
      scheduled: entry.scheduled.toISOString(),
    }));

    expect(response.statusCode).toBe(200);
    
    const data = response.json()
    expect(data).toHaveLength(2)
    expect(data.sort((a: any, b: any) => a.id - b.id)).toEqual(expectedEntries);
  });
});

describe("GET /get/:id", () => {
  it("should return a specific entry by ID", async () => {
    const mockEntry = {
      id: "1",
      title: "Test Entry",
      description: "Test Description",
      created_at: new Date("2025-01-29T23:39:32.021Z"),
      scheduled: new Date("2025-02-02T00:00:00.000Z"),
    };

    await Prisma.entry.create({data: mockEntry})

    const response = await server.inject({
      method: "GET",
      url: "/get/1",
    });

    const expectedEntry = {
      ...mockEntry,
      created_at: mockEntry.created_at.toISOString(),
      scheduled: mockEntry.scheduled.toISOString(),
    };

    expect(response.statusCode).toBe(200);
    
    const data = response.json()
    expect(data).toEqual(expectedEntry);
  });

  it("should return a 500 error if the entry is not found", async () => {

    const response = await server.inject({
      method: "GET",
      url: "/get/nonexistent",
    });

    expect(response.statusCode).toBe(500);

    const data = response.json()
    expect(data).toEqual({
      msg: "Error finding entry with id nonexistent",
    });
  });
});


/* Creating entries */

describe("POST /create/", () => {
  it("should create a new entry", async () => {
    const newEntry = {
      id: "1",
      title: "New Entry",
      description: "New Description",
      created_at: "2025-01-29T23:39:32.000Z",
      scheduled: "2025-02-02T00:00:00.000Z",
    };
    const response = await server.inject({
      method: "POST",
      url: "/create/",
      payload: newEntry
    });

    expect(response.statusCode).toBe(200);

    const data = response.json()
    expect(data).toEqual(newEntry);
  });

  it("should return a 500 error if entry input missing values", async () => {

  const response = await server.inject({
      method: "POST",
      url: "/create/",
      payload: { id: "1", title: "Failed Entry" },
    });

    expect(response.statusCode).toBe(500);

    const data = response.json()
    expect(data).toEqual({ msg: "Error creating entry" });
  });

  it("should return a 500 error if entry input contains extraneous values", async () => {

    const newEntry = {
      id: "1",
      title: "New Entry",
      descripion: "New Description",
      created_at: new Date("2025-01-29T23:39:32.021Z"),
      scheduled: new Date("2025-02-02T00:00:00.000Z"),
      extra: "extra"
    };
    const response = await server.inject({
      method: "POST",
      url: "/create/",
      payload: newEntry
    });

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({ msg: "Error creating entry" });
  });
});


/* Deleting entries */

describe("DELETE /delete/:id", () => {
  it("should delete an entry by ID", async () => {
    const mockEntry = {
      id: "1",
      title: "Test Entry",
      description: "Test Description",
      created_at: new Date("2025-01-29T23:39:32.021Z"),
      scheduled: new Date("2025-02-02T00:00:00.000Z"),
    };

    await Prisma.entry.create({data: mockEntry})

    let response = await server.inject({
      method: "DELETE",
      url: "/delete/1",
    });

    expect(response.statusCode).toBe(200);

    let data = response.json()
    expect(data).toEqual({ msg: "Deleted successfully" });

    response = await server.inject({
      method: "GET",
      url: "/get/",
    });
    data = response.json()
    expect(data).toHaveLength(0)
  });

  it("should return a 500 error if entry does not exist", async () => {
    const response = await server.inject({
      method: "DELETE",
      url: "/delete/1",
    });

    expect(response.statusCode).toBe(500);

    const data = response.json()
    expect(data).toEqual({ msg: "Error deleting entry" });
  });
});


/* Updating entries */

describe("PUT /update/:id", () => {
  it("should update an entry by ID", async () => {
    const mockEntry = {
      id: "1",
      title: "Test Entry",
      description: "Test Description",
      created_at: new Date("2025-01-29T23:39:32.021Z"),
      scheduled: new Date("2025-02-02T00:00:00.000Z"),
    };

    await Prisma.entry.create({data: mockEntry})

    const updatedEntry = {
      id: "1",
      title: "Updated Entry",
      description: "Updated Description",
      created_at: new Date("2025-01-29T23:39:32.021Z"),
      scheduled: new Date("2025-02-02T00:00:00.000Z"),
    };

    const response = await server.inject({
      method: "PUT",
      url: "/update/1",
      payload: updatedEntry
    });

    expect(response.statusCode).toBe(200);

    const data = response.json()
    expect(data).toEqual({ msg: "Updated successfully" });
  });

  it("should return a 500 error if update fails", async () => {
    const response = await server.inject({
      method: "PUT",
      url: "/update/1",
      payload: { id: "1", title: "Failed Update" },
    });

    expect(response.statusCode).toBe(500);

    const data = response.json()
    expect(data).toEqual({ msg: "Error updating" });
  });
});
