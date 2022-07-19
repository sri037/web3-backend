export enum UserEmailTemplatePath {
    USER_INVITE_TEMPLATE_PATH = './src/modules/user/templates/user-invitation-link-email',
    ABOUT_APP_TEMPLATE_PATH = './src/modules/user/templates/about-app-template-link-email',
    USER_VERIFICATION_TEMPLATE_PATH = './src/modules/user/templates/user-signup-email',
    USER_FORGOT_PASSWORD_TEMPLATE_PATH = './src/modules/user/templates/user-reset-password-email',
    USER_ACTIVATE_DEACTIVATE_TEMPLATE_PATH = './src/modules/user/templates/activate-deactivate-user-email',
    USER_WELCOME_TEMPLATE_PATH = './src/modules/user/templates/welcome-user-email',
    REQUEST_CONTENT_PATH = './src/modules/user/templates/request-email',
    ADD_USER_GROUP_PATH = './src/modules/user/templates/add-user-group-email',
    REMOVE_USER_GROUP_PATH = './src/modules/user/templates/delete-user-group-email',
    NEW_THREAD_ADDED = './src/modules/forum/templates/thread-created-email',
    NEW_CATEGORY_ADDED = './src/modules/forum/templates/category-created-email',
    NEW_MESSAGE_ADDED = './src/modules/forum/templates/message-created-email',
    THREAD_DELETED = './src/modules/forum/templates/thread-deleted-email',
    CATEGORY_DELETED = './src/modules/forum/templates/category-deleted-email',
    MESSAGE_DELETED = './src/modules/forum/templates/message-deleted-email'
}

export enum UserEmailSubject {
    USER_RESET_PASSWORD = 'Reset Password'

}
