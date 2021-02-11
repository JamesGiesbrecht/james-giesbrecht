import React from 'react'
import { Card, Typography, makeStyles } from '@material-ui/core'

interface Props {
  title: string,
  content: string,
  className?: string,
}

const useStyles = makeStyles((theme) => ({
  post: {
    padding: theme.spacing(2),
  },
}))

const Post: React.FC<Props> = ({ title, content, className }) => {
  const classes = useStyles()

  return (
    <Card className={[classes.post, className].join(' ')}>
      <Typography variant="h5">{title}</Typography>
      <Typography>{content}</Typography>
    </Card>
  )
}

export default Post
