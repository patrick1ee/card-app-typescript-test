import { server } from "../src/server"
import Prisma from "../src/db";

describe("GET /get/", () => {
  it ("should assert that the fetched entries array is empty", async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/get/'
    });
    
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toEqual([])
  })
});


describe("GET /get/", () => {
  it("should return all entries in the database", async () => {
    const mockEntries = [
      { id: "1", title: "Test Entry 1", created_at: new Date(), scheduled: new Date("2025-02-02T00:00:00") },
      { id: "2", title: "Test Entry 2", created_at: new Date(), scheduled: new Date("2025-03-02T09:00:00") },
    ];
  
    Prisma.entry.findMany = jest.fn().mockResolvedValue(mockEntries);
  
    const response = await server.inject({
      method: "GET",
      url: "/get/",
    });

    const expectedEntries = mockEntries.map(entry => ({
      ...entry,
      created_at: entry.created_at.toISOString(),
      scheduled: entry.scheduled.toISOString(),
    }));
  
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(expectedEntries);
  });
})

describe("GET /get/:id", () => {
  it("should return a specific entry by ID", async () => {
    const mockEntry = {
      id: "1",
      title: "Test Entry",
      created_at: new Date("2025-01-29T23:39:32.021Z"),
      scheduled: new Date("2025-02-02T00:00:00.000Z"),
    };

    Prisma.entry.findUnique = jest.fn().mockResolvedValue(mockEntry);

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
    expect(JSON.parse(response.body)).toEqual(expectedEntry);
  });

  it("should return a 500 error if the entry is not found", async () => {
    Prisma.entry.findUnique = jest.fn().mockResolvedValue(null);

    const response = await server.inject({
      method: "GET",
      url: "/get/nonexistent",
    });

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({
      msg: "Error finding entry with id nonexistent",
    });
  });
});

describe("POST /create/", () => {
  it("should create a new entry", async () => {
    const newEntry = {
      id: "1",
      title: "New Entry",
      created_at: new Date("2025-01-29T23:39:32.021Z"),
      scheduled: new Date("2025-02-02T00:00:00.000Z"),
    };

    Prisma.entry.create = jest.fn().mockResolvedValue(newEntry);

    const response = await server.inject({
      method: "POST",
      url: "/create/",
      payload: {
        id: "1",
        title: "New Entry",
        created_at: "2025-01-29T23:39:32.021Z",
        scheduled: "2025-02-02T00:00:00.000Z",
      },
    });

    const expectedEntry = {
      ...newEntry,
      created_at: newEntry.created_at.toISOString(),
      scheduled: newEntry.scheduled.toISOString(),
    };

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(expectedEntry);
  });

  it("should return a 500 error if creation fails", async () => {
    Prisma.entry.create = jest.fn().mockRejectedValue(new Error("Database error"));

    const response = await server.inject({
      method: "POST",
      url: "/create/",
      payload: { id: "1", title: "Failed Entry" },
    });

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({ msg: "Error creating entry" });
  });
});

describe("DELETE /delete/:id", () => {
  it("should delete an entry by ID", async () => {
    Prisma.entry.delete = jest.fn().mockResolvedValue({});

    const response = await server.inject({
      method: "DELETE",
      url: "/delete/1",
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ msg: "Deleted successfully" });
  });

  it("should return a 500 error if deletion fails", async () => {
    Prisma.entry.delete = jest.fn().mockRejectedValue(new Error("Database error"));

    const response = await server.inject({
      method: "DELETE",
      url: "/delete/1",
    });

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({ msg: "Error deleting entry" });
  });
});

describe("PUT /update/:id", () => {
  it("should update an entry by ID", async () => {
    const updatedEntry = {
      id: "1",
      title: "Updated Entry",
      created_at: new Date("2025-01-29T23:39:32.021Z"),
      scheduled: new Date("2025-02-02T00:00:00.000Z"),
    };

    Prisma.entry.update = jest.fn().mockResolvedValue(updatedEntry);

    const response = await server.inject({
      method: "PUT",
      url: "/update/1",
      payload: {
        id: "1",
        title: "Updated Entry",
        created_at: "2025-01-29T23:39:32.021Z",
        scheduled: "2025-02-02T00:00:00.000Z",
      },
    });

    const expectedEntry = {
      ...updatedEntry,
      created_at: updatedEntry.created_at.toISOString(),
      scheduled: updatedEntry.scheduled.toISOString(),
    };

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ msg: "Updated successfully" });
  });

  it("should return a 500 error if update fails", async () => {
    Prisma.entry.update = jest.fn().mockRejectedValue(new Error("Database error"));

    const response = await server.inject({
      method: "PUT",
      url: "/update/1",
      payload: { id: "1", title: "Failed Update" },
    });

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({ msg: "Error updating" });
  });
});
