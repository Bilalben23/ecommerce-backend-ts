import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { JWTPayload } from "../utils/jwt.js";
import { User } from "../modules/auth/user.model.js";


const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_ACCESS_SECRET
}

passport.use(
    new JwtStrategy(opts, async (payload: JWTPayload, done) => {
        try {
            const user = await User.findById(payload._id)
                .select("-password -passwordResetToken -passwordResetExpires -__v")
                .lean();

            if (!user) {
                return done(null, false);
            }

            return done(null, user);
        } catch (err) {
            done(err, false);
        }
    })
)

export default passport;