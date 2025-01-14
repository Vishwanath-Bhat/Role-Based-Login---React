const {pool} = require("../db")

const Friends = {
    // Add a friend in both directions
    add: async (alumni_id, friend_id) => {
        const query = `
            INSERT IGNORE INTO friends (alumni_id, friend_id) VALUES (?, ?), (?, ?);
        `;
        try {
            const [result] = await pool.execute(query, [alumni_id, friend_id, friend_id, alumni_id]);
            return result.affectedRows > 0; // Returns true if at least one row was inserted
        } catch (error) {
            throw new Error("Error adding friend: " + error.message);
        }
    },

    // List all friends for a given alumni_id
    list: async (alumni_id) => {
        const query = `
            SELECT a.id, a.username, a.name 
            FROM friends f
            JOIN Alumni a ON a.id = f.friend_id
            WHERE f.alumni_id = ?;
        `;
        try {
            const [rows] = await pool.execute(query, [alumni_id]);
            return rows; // Returns the list of friends
        } catch (error) {
            throw new Error("Error retrieving friends: " + error.message);
        }
    },
}

module.exports = Friends;