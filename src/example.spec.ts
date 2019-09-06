// Mockup test
describe('My test', () => {
  it('should return true', () => {
    expect(true).toEqual(true);
  });
  it('should be running on development environment', () => {
    expect(process.env.NODE_ENV).toEqual('development');
  });
});

// Feature
export class FriendsList {
  friends = [];
  addFriend(name) {
    this.friends.push(name);
    this.announceFriendship(name);
  }
  announceFriendship(name) {
    console.log(`${name} is now a friend!`);
  }
  removeFriend(name) {
    const index = this.friends.indexOf(name);
    if (index === -1) {
      throw new Error('Friend is not is the list!');
    }
    this.friends.splice(index, 1);
  }
}

describe('FriendsList', () => {
  let friendsList;

  beforeEach(() => {
    // Whatever is inside here will run before each one of the it scenarios bellow.
    friendsList = new FriendsList();
  });

  it('Initializes a friends list', () => {
    expect(friendsList.friends.length).toEqual(0);
  });

  it('Adds a friend to the list', () => {
    friendsList.addFriend('Bernardo');
    expect(friendsList.friends.length).toEqual(1);
  });

  // The use of mock functions
  it('Announces friendship', () => {
    // Declare a mock function.
    friendsList.announceFriendship = jest.fn();
    expect(friendsList.announceFriendship).not.toHaveBeenCalled();
    friendsList.addFriend('Bernardo');
    expect(friendsList.announceFriendship).toHaveBeenCalled();
    expect(friendsList.announceFriendship).toHaveBeenCalledWith('Bernardo');
  });

  // Describe block can also be nested.
  describe('RemoveFriend', () => {
    it('Removes a friend from the list', () => {
      friendsList.addFriend('Bernardo');
      expect(friendsList.friends[0]).toEqual('Bernardo');
      friendsList.removeFriend('Bernardo');
      expect(friendsList.friends[0]).toBeUndefined();
    });
    // Error handling
    it('Throws an error if friend is not in the list', () => {
      expect(() => friendsList.removeFriend('Bernardo')).toThrow();
      // Expecting to throw Error
      expect(() => friendsList.removeFriend('Bernardo')).toThrow(Error);
      // Expecting to throw exact Error
      expect(() => friendsList.removeFriend('Bernardo')).toThrow(
        new Error('Friend is not is the list!'),
      );
    });
  });
});
