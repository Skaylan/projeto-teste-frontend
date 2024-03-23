

export interface userTypeInterface {
  id: string;
  descr: string;
  created_at: Date;
  updated_at: Date;
}

export interface paramType {
  params: { id: string };
}

export interface decoded {
  email: string,
	id: string
}

export interface user {
	id: string,
  email: string,
	name: string,
	user_type: userTypeInterface,
	created_at: Date,
	updated_at: Date
}

export interface post {
  content: string
  id: string,
  owner_info: user ,
  created_at: Date,
  commentsAmout: number,
  func: Function,
  image?: string
}

export interface comment {
  id: string,
  comment: string,
  create_at: string
  owner: user,
}

export interface replyView {
  reply_id: string,
  reply_content: string,
  reply_owner_id: string
} 

export interface commentView {
  comment_id: string,
  comment_content: string,
  comment_owner_id: string,
  replies: replyView[],
  user_full_name: string
}
export interface postView {
  comments: commentView[],
  post_id: string,
  post_content: string,
  post_owner_id: string
  user_full_name: string,
  user_id: string,
  created_at: Date
}

export type FriendType = {
  id: string,
  user_id: string,
  friend_id: string,
  friend: user

}

export interface propView {
  post: postView
}

export interface userTypeInterface {
  id: string
  descr: string,
  created_at: Date,
  updated_at: Date
}

export interface reply {
  id: string,
  owner_id: string,
  comment: string,
  created_at: Date,
  owner: user
}

export type token = {
  email: string,
  id: string,
  name: string
}