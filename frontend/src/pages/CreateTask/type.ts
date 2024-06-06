export interface Task {
  title: string;
  desc: string;
  tags: string[];
  dueDate: string;
  priority: 'low' | 'medium' | 'high'; 
  status: 'Assigned' | 'InProgress' | 'Completed'; 
  assigner: {
    _id:string,
    username:string,
    email:string
  };
  assignee: string[];
  comments: [
    {
      _id:string
      content:string
      createdAt:string
      user:string
    }
  ];
  activity: string[];
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Interface for the response structure

