import userModel from "../model/userModel";
import bcrypt from "bcrypt";

export const registerRouter = async (req, res) => {
    // console.log(req.body);
    try {
        const {username, email, password} = req.body;
        const userCheck = await userModel.findOne({ username });
        if(userCheck){
            return res.status(400).json({
                message: "Username already used",
            })
        }
        const emailCheck = await userModel.findOne({ email });
        if(emailCheck){
            return res.status(400).json({
                message: "Email already used",
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            username,
            email,
            password: hashedPassword,
        });
        delete user.password;
        return res.json({
            status: true,
            user
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}
export const loginRouter = async (req, res) => {
    // console.log(req.body);
    try {
        const {username, password} = req.body;
        const user = await userModel.findOne({ username });
        if(!user){
            return res.status(400).json({
                message: "Incorrect username or password",
            })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid)
            return res.json({
                message: "Incorrect password"
            });
            delete user.password;
            return res.json({ 
                status: true,
                user
            })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}

export const setAvatar = async (req, res) =>{
    try {

    const userId = req.params.id;
    const avatar = req.body.image;
    const userData = await userModel.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatar,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatar,
    });
        
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }

}


export const getAllusers = async (req, res) =>{
    try {
        
        // const id = req.params.id;
        // const userData = await userModel.find({_id: id}).select([
        //     "username",
        //     "email",
        //     "avatar",
        //     "_id",
        // ]);
        // if(userData){
        //     return res.status(200).json({
        //         data: userData,
        //         message: "success"
        //     })
        // }

        const users = await userModel.find({ _id: { $ne: req.params.id } }).select([
            "email",
            "username",
            "avatar",
            "_id",
          ]);
          return res.json(users);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        })
    }
}