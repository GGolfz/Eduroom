const pool = require('../../database/db')

const getChatlist = async (req, res, next) => {
  const userid = '3c93e461-7eab-45fb-b8ce-587b47286f8c'
  const chatlist = await pool.query(
    `select chat.chatroomid, usp.firstname, roomname, message, to_char(sendtime,'DD/MM') as sendtime from chat, chat_message cm, 
    user_profile usp where cm.chatroomid in ( select crm.chatroomid from chat_roommember crm where userid = '${userid}' ) 
    and cm.userid = usp.userid and chat.chatroomid in ( select chat.chatroomid from chat where sendtime = 
      (select max(sendtime) from chat_message where chat.chatroomid = chat_message.chatroomid) 
      group by chat.chatroomid ) order by sendtime desc `
  )

  const list = chatlist.rows
  res.send(list)
}

const getGroupPicture = async (req, res, next) => {
  let chatroomid = 3
  const messagelist = await pool.query(`select avatar
  from user_profile, chat_roommember
  where user_profile.userid = chat_roommember.userid and
        chatroomid = '${chatroomid}'
  `)

  const mes = messagelist.rows
  res.send(mes)
}

const inviteCreate = async (req, res, next) =>{
 await pool.query(`insert into chat_invitation(invitationid, date, chatroomid, invitor_id)
 values (2,current_date,5,d8bd910c-16fa-4bcf-acbf-a12b1a8322fb);
 insert into invite_invitees(invitationid, inviteeid)
 values (5,236ce084-b742-4435-93c7-2e0d1eff1204)`)

 res.status(200).json({ success: true})

}
module.exports = { getChatlist, getGroupPicture, inviteCreate}

