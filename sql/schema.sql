CREATE TABLE users(
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    ismanager TINYINT NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE task (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255),
    note LONGTEXT,
    deadline DATE,
    status TINYINT NOT NULL,
    PRIMARY KEY (id)
);
/* To assign tasks to members*/
CREATE TABLE assigned_member (
    task_id INT,
    user_id INT,
    PRIMARY KEY (task_id),
    FOREIGN KEY (task_id) REFERENCES task(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE profile(
    user_id INT,
    name VARCHAR(255),
    age VARCHAR(255),
    gender VARCHAR(255),
    company VARCHAR(255),
    capability VARCHAR(255),
    avail_from DATE,
    avail_to DATE,
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

/*create user profile once a user is added*/
delimiter |
CREATE TRIGGER user_profile AFTER INSERT ON users FOR EACH ROW
BEGIN
INSERT INTO profile (user_id,name,age,gender,company,capability,avail_from,avail_to)
VALUES(NEW.id,NEW.username,null,null,null,null,null,null);
END
|

delimiter ;

CREATE TABLE task_group(
    task_id INT,
    name varchar(255),
    id INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id),
    FOREIGN KEY (task_id) REFERENCES task(id) ON DELETE SET NULL
);
