const db = require('../config');

const getAllMembers = async (req, res) => {
  const membersSnapshot = await db.collection('members').get();
  const members = membersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.send(members);
};

const searchMembers = async (req, res) => {
  const { query } = req.query;

  const searchById = query.match(/^\d+$/);
  let membersSnapshot;

  if (searchById) {
    membersSnapshot = await db.collection('members').doc(query).get();
    if (!membersSnapshot.exists) return res.status(404).send('Member not found.');
    const member = { id: membersSnapshot.id, ...membersSnapshot.data() };
    return res.send(member);
  } else {
    membersSnapshot = await db.collection('members').where('name', '==', query).get();
    const members = membersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.send(members);
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
