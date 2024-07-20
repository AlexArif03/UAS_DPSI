const db = require('../config');

const getAllMembers = async (req, res) => {
  const membersSnapshot = await db.collection('members').get();
  const members = membersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.send(members);
};

const searchMembers = async (req, res) => {
  try {
    const { query } = req.query;

    const searchById = query.match(/^\d+$/);
    let memberData;

    if (searchById) {
      const memberSnapshot = await db.collection('members').doc(query).get();
      if (!memberSnapshot.exists) {
        return res.status(404).json({ message: 'Member not found.' });
      } 
      memberData = { id: memberSnapshot.id, ...memberSnapshot.data() };
    } else {
      const membersSnapshot = await db.collection('members').where('name', '==', query).get();
      memberData = membersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    res.json({
      message: memberData.length > 1 ? "Members found:" : "Member found:", // Adjust message based on results
      data: memberData 
    });
  } catch (error) {
    console.error("Error during member search:", error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


const addMember = async (req, res) => {
  const { id, name, class: memberClass, birthDate, address } = req.body;

  await db.collection('members').doc(id).set({
    name,
    class: memberClass,
    birthDate,
    address
  });

  res.status(201).send('Member added.');
};

module.exports = { getAllMembers, searchMembers, addMember };
