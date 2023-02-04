import { LauncherProfile, ProfileManager, ProfileStorage } from "./../profile";
import { expect } from "chai";
import { getProfileFileName, hasProfileFile } from "../profile";
import fse from "fs-extra";
import { v4 } from "uuid";
import {
  getGlobalManifest,
  getManifestFileName,
  resolveManifest,
} from "../manifest";

describe("ProfileManager ", () => {
  afterEach(() => {
    // Clean the path for other test
    if (fse.existsSync(getProfileFileName())) {
      fse.removeSync(getProfileFileName());
    }
    expect(fse.existsSync(getProfileFileName())).to.be.false;
  });

  it("should throw exception wisely", () => {
    expect(() => {
      ProfileManager.getProfileFromFile();
    }).to.throws(
      "The profile file is not existed, should run setupDefaultProfile to generate a default profile."
    );
  });

  it("should make profiles.json when setup", () => {
    expect(getProfileFileName()).to.includes("profiles.json");
    expect(hasProfileFile()).to.be.false;

    expect(() => {
      ProfileManager.setupDefaultProfile();
    }).to.not.throw();

    expect(hasProfileFile()).to.be.true;

    // Assert the profile getter, response a launcher profile object
    const defaultProfileData = ProfileManager.getProfileFromFile();
    expect(defaultProfileData).to.have.property(`items`);
    expect(Array.isArray(defaultProfileData.items));
    expect(defaultProfileData.items.length).to.be.eq(1);

    // Assert the default profile setup
    const defaultProfileItem = defaultProfileData.items[0];
    expect(defaultProfileItem.name).to.be.eq("Latest");
    expect(defaultProfileItem.minecraftVersion).to.be.eq("latest");

    // Assert save function
    defaultProfileData.items.push({
      uid: v4(),
      name: "1.12.2",
      minecraftVersion: "1.12.2",
    });
    ProfileManager.storeProfile(defaultProfileData);
    const afterUpdateProfileData = ProfileManager.getProfileFromFile();
    expect(afterUpdateProfileData).to.have.property(`items`);
    expect(Array.isArray(afterUpdateProfileData.items));
    expect(afterUpdateProfileData.items.length).to.be.eq(2);

    expect(afterUpdateProfileData.items[0].name).to.eq("Latest");
    expect(afterUpdateProfileData.items[0].minecraftVersion).to.eq("latest");

    expect(afterUpdateProfileData.items[1].name).to.eq("1.12.2");
    expect(afterUpdateProfileData.items[1].minecraftVersion).to.eq("1.12.2");
  });
});

describe("ProfileStorage", () => {
  describe(`Not setup version manifest yet`, () => {
    it(`should throw exception when construct ProfileStorage`, () => {
      ProfileManager.setupDefaultProfile();
      const launcherProfile = ProfileManager.getProfileFromFile();
      expect(launcherProfile).not.to.be.undefined;

      // Assertion throws when construct new profile storage without version manifest loaded
      expect(() => {
        new ProfileStorage(launcherProfile);
      }).to.throws(
        `Global manifest has not loaded. Should call resolveManifest before load profile storage.`
      );
    });
  });

  describe(`Set up version manifest`, () => {
    before((done) => {
      // Setup the version manifest for profile test
      resolveManifest()
        .then(() => {
          expect(fse.existsSync(getManifestFileName())).to.be.true;
          done();
        })
        .catch(done);
    });

    it(`should throw exception when construct undefined parameter ProfileStorage`, () => {
      expect(() => {
        new ProfileStorage(undefined as unknown as LauncherProfile);
      }).to.throws(`Profile cannot be undefined.`);
    });

    it(`should throw when not found compatible minecraft version for profile item`, () => {
      ProfileManager.setupDefaultProfile();
      ProfileManager.getProfileFromFile();

      expect(() => {
        new ProfileStorage({
          items: [
            {
              name: "latest",
              minecraftVersion: "non-exist-version",
              uid: v4(),
            },
          ],
        });
      }).to.throws(/Invalid minecraft version.+/);
    });

    it(`should fill profile storage with compatible version from MinecraftSemver`, () => {
      ProfileManager.setupDefaultProfile();
      const launcherProfile = ProfileManager.getProfileFromFile();
      const profileStorage = new ProfileStorage(launcherProfile);

      // Assert profile response from storage
      const profileItemList = profileStorage.getAllProfileItems();
      expect(Array.isArray(profileItemList)).to.be.true;
      expect(profileItemList.length).to.be.eq(1);

      const latestMinecraftVersion = getGlobalManifest()?.getLatestRelease();

      // Assert the generated default profile item
      const defaultProfileItem = profileItemList[0];
      expect(defaultProfileItem.minecraftVersion).to.be.eq(
        latestMinecraftVersion
      );

      // Assert existing on the profile map
      expect(profileStorage.getProfileFromUid(defaultProfileItem.uid)).to.be.eq(
        defaultProfileItem
      );

      // Assert undefined returns for profile map getter
      expect(profileStorage.getProfileFromUid("non-exist-profile-uid")).to.be
        .undefined;

      // Assert for get profile from the minecraft version
      const fromMinecraftVersion =
        profileStorage.getProfileFromMinecraftVersion(
          latestMinecraftVersion as string
        );

      expect(Array.isArray(fromMinecraftVersion)).to.be.true;
      expect(fromMinecraftVersion.length).to.eq(1);
      expect(defaultProfileItem.uid).to.eq(fromMinecraftVersion[0].uid);

      // Assert to launcher profile
      const toLauncherProfileObject = profileStorage.toLauncherProfile();
      expect(toLauncherProfileObject).to.have.property("items");
      expect(Array.isArray(toLauncherProfileObject.items)).to.be.true;
      expect(toLauncherProfileObject.items.length).to.be.eq(1);
      expect(toLauncherProfileObject.items[0].uid).to.be.eq(
        defaultProfileItem.uid
      );
    });

    it(`should create new profile and delete it`, () => {
      ProfileManager.setupDefaultProfile();
      const launcherProfile = ProfileManager.getProfileFromFile();
      const profileStorage = new ProfileStorage(launcherProfile);

      const latestMinecraftVersion =
        getGlobalManifest()?.getLatestRelease() as string;
      const profileGeneratedUid = v4();
      expect(() => {
        profileStorage.createProfileItem({
          minecraftVersion: latestMinecraftVersion,
          uid: profileGeneratedUid,
          name: "Second Latest Profile",
        });
      }).not.to.throws();

      const lastInsertProfile =
        profileStorage.getProfileFromUid(profileGeneratedUid);
      expect(lastInsertProfile).to.not.be.undefined;
      expect(profileStorage.toLauncherProfile().items.length).to.be.eq(2);

      // Remove assertion
      expect(() => {
        profileStorage.removeProfileItem(
          lastInsertProfile?.uid as unknown as string
        );
      }).not.to.throws(/Profile with uid.+/);

      expect(profileStorage.getAllProfileItems().length).to.be.eq(1);
    });

    it(`should throw exception on create or delete function`, () => {
      ProfileManager.setupDefaultProfile();
      const launcherProfile = ProfileManager.getProfileFromFile();
      const profileStorage = new ProfileStorage(launcherProfile);
      const conflictUid = profileStorage.getAllProfileItems()[0].uid;
      expect(() => {
        profileStorage.createProfileItem({
          minecraftVersion: "non-exist-mc-version",
          uid: v4(),
          name: "Second Latest Profile",
        });
      }).to.throws(/Invalid minecraft version.+/);

      const latestMinecraftVersion =
        getGlobalManifest()?.getLatestRelease() as string;
      expect(() => {
        profileStorage.createProfileItem({
          minecraftVersion: latestMinecraftVersion,
          uid: v4(),
          name: undefined as unknown as string,
        });
      }).to.throws(/Profile name cannot be undefined/);

      expect(() => {
        profileStorage.createProfileItem({
          minecraftVersion: latestMinecraftVersion,
          uid: undefined as unknown as string,
          name: "Other latest #1",
        });
      }).to.throws(/Profile uid cannot be undefined/);

      expect(() => {
        profileStorage.createProfileItem({
          minecraftVersion: latestMinecraftVersion,
          uid: conflictUid,
          name: "Other latest #2",
        });
      }).to.throws(/Uid conflict/);

      // Remove undefined uid
      expect(() => {
        profileStorage.removeProfileItem(v4());
      }).to.throws(/Profile with uid.+/);
    });

    it(`should parse latest release /latest snapshot`, () => {
      const latestReleaseMinecraftVersion =
        getGlobalManifest()?.getLatestRelease() as string;

      const latestSnapshotMinecraftVersion =
        getGlobalManifest()?.getLatestSnapshot() as string;

      const releaseProfileItemUid = v4();
      const releaseProfileStorage = new ProfileStorage({
        items: [
          {
            name: "Latest release",
            minecraftVersion: "latest",
            uid: releaseProfileItemUid,
          },
        ],
      });

      expect(
        releaseProfileStorage.getProfileFromUid(releaseProfileItemUid)
          ?.minecraftVersion
      ).to.eq(latestReleaseMinecraftVersion);

      const snapshotProfileItemUid = v4();
      const snapshotProfileStorage = new ProfileStorage({
        items: [
          {
            name: "Latest snapshot release",
            minecraftVersion: "latest_snapshot",
            uid: snapshotProfileItemUid,
          },
        ],
      });

      expect(
        snapshotProfileStorage.getProfileFromUid(snapshotProfileItemUid)
          ?.minecraftVersion
      ).to.eq(latestSnapshotMinecraftVersion);
    });
  });
});
