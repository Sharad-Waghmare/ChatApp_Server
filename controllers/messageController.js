import messageModel from "../model/messageModel";

export const getMessage = async (req, res) =>{
    try {
        
    const { from, to } = req.body;

    const messages = await messageModel.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);

    } catch (error) {
                return res.status(500).json({
            message: error.message,
        });
    }

};

export const addMessage = async (req, res) =>{
    try {

        const { from, to, message } = req.body;
        const data = await messageModel.create({
          message: { text: message },
          users: [from, to],
          sender: from,
        });
    
        if (data) return res.json({ msg: "Message added successfully." });
        else return res.json({ msg: "Failed to add message to the database" });
        
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }

}