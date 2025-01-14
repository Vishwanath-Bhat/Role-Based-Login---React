const { pool } = require("../db");

const createFriendsTable = async () => {
    const friendsTableQuery = `
        CREATE TABLE IF NOT EXISTS friends (
            alumni_id CHAR(36) NOT NULL,             -- Foreign key for the alumni
            friend_id CHAR(36) NOT NULL,             -- Foreign key for the friend
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (alumni_id) REFERENCES Alumni(id) ON DELETE CASCADE,
            FOREIGN KEY (friend_id) REFERENCES Alumni(id) ON DELETE CASCADE
            UNIQUE (alumni_id, friend_id)
        );
    `;//ON DELETE CASCADE : it automatically deletes all friens if the alumni is deleted in alumni table

    try {
        await pool.execute(friendsTableQuery);
        console.log("Friends table created successfully.");
    } catch (err) {
        console.error("Error creating friends table:", err.message);
    } finally {
        pool.end();
    }
};

createFriendsTable();



