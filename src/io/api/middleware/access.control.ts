/**
 * @function, a middleware to check if the user can access an endpoint
 * @params {Array<Roles>}, roles
 * @returns, on success -> control is passed to next function.
 * @returns, on error ->  returns an error message 'User is not authorized'
 **/
export default function acl(...allowedRoles) {
    // check if logged in user role exists in allowedRoles
    const isAllowed = role => allowedRoles.indexOf(role) > -1;

    // return a middleware
    return (request, response, next) => {
        if (request.user && isAllowed(request.user.roles))
            // role is allowed, so continue on the next middleware
            next();
        else {
            response.status(403).send({
                code: 'User is not authorized'
            });
        }
    };
}
