import React from "react";
import "./Announcements.scss";

interface AnnouncementsProps {
  announcements: string[];
}

const Announcements: React.FC<AnnouncementsProps> = ({ announcements }) => {
  return (
    <div className="announcements-bar">
      <div className="announcements-content">
        {announcements.map((announcement, index) => (
          <div key={index} className="announcement-item">
            {announcement}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
